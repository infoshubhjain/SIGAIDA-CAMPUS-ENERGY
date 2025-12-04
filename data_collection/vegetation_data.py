import ee
ee.Authenticate()
ee.Initialize(project='sigaida-vegetation')


roi = ee.Geometry.Rectangle([-88.25, 40.09, -88.21, 40.115])  # ROI: UIUC / Urbana-Champaign bounding box
cell_size_m = 100  # Grid cell size (meters)

start_year = 2016
end_year = 2025
drive_folder = 'sigaida_ndvi_data'

# Sentinel-2 collection and cloud filter threshold
collection_id = 'COPERNICUS/S2_HARMONIZED'
max_cloud_pct = 30

# ---- CREATE GRID (100m x 100m) USING A METER-BASED PROJECTION ----
# Use Web Mercator (EPSG:3857) projection and coveringGrid to get exact meter cells
proj = ee.Projection('EPSG:3857').atScale(cell_size_m)
grid_fc = roi.coveringGrid(proj)


# ---- Prepare image collection (NDVI band added) ----
def add_ndvi(image):
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
    return image.addBands(ndvi)

s2 = (ee.ImageCollection(collection_id)
      .filterBounds(roi)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', max_cloud_pct))
      .map(add_ndvi))

# get data for that month and export it to Drive
def export_monthly_ndvi(year, month):
    start = ee.Date.fromYMD(year, month, 1)
    end = start.advance(1, 'month')
    img = s2.filterDate(start, end).select('NDVI').mean()
    # If no images in that month the mean() returns an image with masked pixels; later reduceRegions will result in nulls
    
    # reduceRegions to compute mean NDVI per cell
    reduced = img.reduceRegions(
        collection=grid_fc,
        reducer=ee.Reducer.mean(),
        scale=cell_size_m,
        crs='EPSG:3857'
    ).map(lambda feat: ee.Feature(None).set({
        'year': ee.Number(year),
        'month': ee.Number(month),
        'ndvi': ee.Feature(feat).get('mean'),
        'lon': ee.Feature(feat).geometry().centroid(maxError=1).transform('EPSG:4326', 1).coordinates().get(0),
        'lat': ee.Feature(feat).geometry().centroid(maxError=1).transform('EPSG:4326', 1).coordinates().get(1)
    }))
    
    filename = f"uiuc_ndvi_{year}_{month:02d}"
    
    task = ee.batch.Export.table.toDrive(
        collection=reduced,
        description=filename,
        folder=drive_folder,
        fileNamePrefix=filename,
        fileFormat='CSV'
    )
    task.start()
    print(f"Export started for {year}-{month:02d}")


for year in range(start_year, end_year + 1):
    for month in range(1, 13):
        export_monthly_ndvi(year, month)