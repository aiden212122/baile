import React, { ChangeEvent } from 'react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  selectedImage: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, selectedImage }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract raw base64 and mime type
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const rawBase64 = matches[2];
          onImageSelected(rawBase64, mimeType);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full mb-8">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        第一步：上传您的照片 (建议半身像或自拍)
      </label>
      
      <div className="flex flex-col items-center justify-center w-full">
        <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${selectedImage ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
          {selectedImage ? (
            <div className="relative w-full h-full p-2">
               <img src={`data:image/png;base64,${selectedImage}`} alt="Preview" className="w-full h-full object-contain rounded-lg" />
               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <p className="text-white font-semibold">点击更换照片</p>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="text-mb text-gray-500"><span className="font-semibold">点击上传</span> 或拖拽照片到此处</p>
              <p className="text-xs text-gray-500 mt-1">支持 PNG, JPG, JPEG</p>
            </div>
          )}
          <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};
