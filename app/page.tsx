"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import {
  AlertCircle,
  Download,
  Link2,
  QrCode,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [generatedData, setGeneratedData] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!inputUrl.trim()) {
      setError("Please enter a valid URL or text.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedData(inputUrl.trim());
      setIsGenerating(false);
    }, 400);
  };

  const downloadQRCode = async () => {
    if (!generatedData) return;
    setIsDownloading(true);

    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(generatedData)}&margin=1&size=512`;

    try {
      const response = await fetch(qrImageUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "qrcode.png";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download QR code", err);
      window.open(qrImageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-10 z-10">
        {/* Left Column: Input Form */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
              <QrCode size={28} strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              QR Code Generator
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Instantly create standard QR codes from links, text, or contact
              information. Fast, reliable, high-quality, and{" "}
              <span className="font-semibold text-indigo-600">
                forever free
              </span>
              .
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="url-input"
                className="block text-sm font-semibold text-slate-700"
              >
                Destination URL or Text
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Link2 className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="url-input"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g., https://example.com"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm flex items-center mt-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={14} className="mr-1" /> {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isGenerating || !inputUrl.trim()}
              className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-2xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCcw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="-ml-1 mr-2 h-5 w-5" />
                  Generate QR Code
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 relative overflow-hidden transition-all duration-300">
          {generatedData ? (
            <div className="flex flex-col items-center space-y-6 w-full animate-in zoom-in-95 duration-500">
              <div className="p-4 bg-white rounded-2xl shadow-lg ring-1 ring-slate-900/5">
                <Image
                  src={`https://quickchart.io/qr?text=${encodeURIComponent(generatedData)}&margin=1&size=300`}
                  alt="Generated QR Code"
                  width={256}
                  height={256}
                  className="object-contain"
                  crossOrigin="anonymous"
                  unoptimized
                />
              </div>

              <div className="w-full max-w-[280px]">
                <button
                  onClick={downloadQRCode}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isDownloading ? (
                    <RefreshCcw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  ) : (
                    <Download className="-ml-1 mr-2 h-4 w-4" />
                  )}
                  {isDownloading ? "Downloading..." : "Download PNG"}
                </button>
              </div>

              <p className="text-xs text-slate-400 text-center truncate w-full max-w-[280px]">
                Points to: {generatedData}
              </p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center opacity-60">
              <div className="w-24 h-24 mb-4 text-slate-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <rect x="7" y="7" width="3" height="3"></rect>
                  <rect x="14" y="7" width="3" height="3"></rect>
                  <rect x="7" y="14" width="3" height="3"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                </svg>
              </div>
              <p className="text-slate-500 font-medium">
                Your QR code will appear here
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Enter a URL to get started
              </p>
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `,
        }}
      />
    </div>
  );
}
