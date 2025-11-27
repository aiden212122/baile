import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg rounded-b-xl mb-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">📸 圣经人物合影生成器</h1>
        <p className="text-blue-100 text-sm md:text-base">
          上传自拍，选择您心目中的圣经人物，利用 AI 生成跨越时空的合照。
        </p>
      </div>
    </header>
  );
};
