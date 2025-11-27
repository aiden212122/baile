import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { FigureSelector } from './components/FigureSelector';
import { generateBiblicalSelfie } from './services/geminiService';
import { GenerationState } from './types';

export default function App() {
  const [sourceImage, setSourceImage] = useState<{ base64: string, mimeType: string } | null>(null);
  const [targetFigure, setTargetFigure] = useState<string>('Jesus');
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultImage: null,
  });

  const handleImageSelected = (base64: string, mimeType: string) => {
    setSourceImage({ base64, mimeType });
    // Reset result if new image uploaded
    setState(prev => ({ ...prev, resultImage: null, error: null }));
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      setState(prev => ({ ...prev, error: "请先上传一张照片。" }));
      return;
    }
    if (!targetFigure) {
      setState(prev => ({ ...prev, error: "请选择或输入一个人物。" }));
      return;
    }

    setState({ isLoading: true, error: null, resultImage: null });

    try {
      const resultBase64 = await generateBiblicalSelfie(sourceImage.base64, sourceImage.mimeType, targetFigure);
      setState({ isLoading: false, error: null, resultImage: resultBase64 });
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        error: err.message || "生成失败，请检查网络或 API Key。", 
        resultImage: null 
      });
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          
          <ImageUpload 
            onImageSelected={handleImageSelected} 
            selectedImage={sourceImage?.base64 || null} 
          />
          
          <FigureSelector onFigureChange={setTargetFigure} />

          <div className="mt-8">
            <button
              onClick={handleGenerate}
              disabled={state.isLoading || !sourceImage}
              className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all 
                ${state.isLoading || !sourceImage 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {state.isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在利用 Gemini 2.5 Flash 施展魔法...
                </div>
              ) : (
                '生成合影'
              )}
            </button>
            {(!sourceImage) && (
              <p className="text-center text-sm text-gray-400 mt-2">请先上传照片以激活按钮</p>
            )}
          </div>
        </div>

        {state.error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-8 animate-fade-in" role="alert">
            <p className="font-bold">出错啦</p>
            <p>{state.error}</p>
          </div>
        )}

        {state.resultImage && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in">
             <div className="bg-green-600 text-white p-4 text-center">
                <h2 className="text-xl font-bold">✨ 合影生成成功!</h2>
             </div>
             <div className="p-4 md:p-8 flex flex-col items-center">
                <img 
                  src={state.resultImage} 
                  alt="Generated Selfie" 
                  className="w-full max-w-lg rounded-lg shadow-lg border border-gray-200"
                />
                
                <div className="mt-6 flex gap-4">
                  <a 
                    href={state.resultImage} 
                    download={`biblical-selfie-${targetFigure}.png`}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    下载图片
                  </a>
                  <button 
                    onClick={() => {
                        setState(prev => ({ ...prev, resultImage: null }));
                        setSourceImage(null);
                    }}
                    className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    再来一张
                  </button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
