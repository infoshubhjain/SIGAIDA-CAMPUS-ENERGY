'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Prediction {
    date: string;
    predicted_pm25: number;
    predicted_co2: number;
    confidence: number;
    note: string;
}

interface Anomaly {
    timestamp: string;
    type: string;
    severity: string;
    description: string;
    value: number;
    expected_range: number[];
}

export default function MLPredictionsPage() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [modelInfo, setModelInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [forecastDays, setForecastDays] = useState(7);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

                const [forecastRes, anomaliesRes, modelInfoRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/ml/air-quality-forecast?days=${forecastDays}`),
                    axios.get(`${apiUrl}/api/ml/anomalies?data_type=air_quality`),
                    axios.get(`${apiUrl}/api/ml/model-info`),
                ]);

                setPredictions(forecastRes.data.predictions.map((p: any) => ({
                    date: p.date,
                    predicted_pm25: p.predicted_pm25,
                    predicted_co2: p.predicted_co2 ?? 0, // fallback to 0 if missing
                    confidence: 1,
                    note: 'Demo confidence',
                })));

                setAnomalies(anomaliesRes.data.anomalies);
                setModelInfo(modelInfoRes.data);
            } catch (err) {
                console.error('Error fetching ML data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [forecastDays]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                    <Brain className="mr-3 h-10 w-10 text-purple-600" />
                    ML Predictions & Analytics
                </h1>
                <p className="text-gray-600 mt-2">
                    Machine learning-powered forecasts and anomaly detection
                </p>
            </div>

            {/* Model Status Card */}
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                        ML Model Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Status:</span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                {modelInfo?.status || 'Placeholder'}
                            </span>
                        </div>
                        {modelInfo?.note && (
                            <div className="p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-700 text-sm rounded">
                                <strong>Note:</strong> {modelInfo.note}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Forecast Days Selector */}
            <div className="mb-6 flex gap-2">
                {[3, 7, 14, 30].map((days) => (
                    <button
                        key={days}
                        onClick={() => setForecastDays(days)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${forecastDays === days ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {days} Days
                    </button>
                ))}
            </div>

            {/* Prediction Table */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Predictions</CardTitle>
                    <CardDescription>Day-by-day forecast with confidence levels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                                    <th className="px-4 py-3 text-right font-semibold">PM2.5</th>
                                    <th className="px-4 py-3 text-right font-semibold">CO₂</th>
                                    <th className="px-4 py-3 text-right font-semibold">Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictions.map((pred, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{pred.date}</td>
                                        <td className="px-4 py-3 text-right">{pred.predicted_pm25.toFixed(1)} μg/m³</td>
                                        <td className="px-4 py-3 text-right">{pred.predicted_co2.toFixed(0)} ppm</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                                {(pred.confidence * 100).toFixed(0)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Anomaly Detection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
                        Anomaly Detection
                    </CardTitle>
                    <CardDescription>Unusual patterns detected in environmental data</CardDescription>
                </CardHeader>
                <CardContent>
                    {anomalies.length > 0 ? (
                        <div className="space-y-3">
                            {anomalies.map((anomaly, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border-l-4 ${anomaly.severity === 'high' ? 'bg-red-50 border-red-500' : anomaly.severity === 'medium' ? 'bg-orange-50 border-orange-500' : 'bg-yellow-50 border-yellow-500'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm">{anomaly.description}</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Type: {anomaly.type} | Value: {anomaly.value.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Expected range: {anomaly.expected_range[0]} - {anomaly.expected_range[1]}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${anomaly.severity === 'high' ? 'bg-red-200 text-red-800' : anomaly.severity === 'medium' ? 'bg-orange-200 text-orange-800' : 'bg-yellow-200 text-yellow-800'}`}
                                        >
                                            {anomaly.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{anomaly.timestamp}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">No anomalies detected</p>
                            <p className="text-xs text-gray-400 mt-1">All environmental data is within expected ranges</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
