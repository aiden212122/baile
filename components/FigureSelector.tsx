import React, { useState, useEffect } from 'react';
import { FigureOption } from '../types';

interface FigureSelectorProps {
  onFigureChange: (figure: string) => void;
}

export const FigureSelector: React.FC<FigureSelectorProps> = ({ onFigureChange }) => {
  const [selectedOption, setSelectedOption] = useState<FigureOption>(FigureOption.JESUS);
  const [customFigure, setCustomFigure] = useState<string>('');

  useEffect(() => {
    if (selectedOption === FigureOption.CUSTOM) {
      onFigureChange(customFigure);
    } else {
      // Extract the English name for better prompting, but the enum value is fine to pass
      // Actually passing the full string "Jesus (耶稣)" works okay, but cleaner to extract english
      // Let's pass the full string, the model is smart enough.
      const nameOnly = selectedOption.split('(')[0].trim(); 
      onFigureChange(nameOnly);
    }
  }, [selectedOption, customFigure, onFigureChange]);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFigure(e.target.value);
  };

  return (
    <div className="w-full mb-8">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        第二步：选择想合影的人物
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.values(FigureOption).map((option) => (
          <div key={option} 
            className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${selectedOption === option ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300'}`}
            onClick={() => setSelectedOption(option)}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${selectedOption === option ? 'border-indigo-500' : 'border-gray-400'}`}>
                {selectedOption === option && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
              </div>
              <span className="text-sm font-medium text-gray-800">{option.split('(')[1].replace(')', '') || option}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedOption === FigureOption.CUSTOM && (
        <div className="mt-4 animate-fade-in">
          <label className="block text-gray-600 text-xs mb-1">输入人物名称 (例如: 诺亚, 参孙)</label>
          <input
            type="text"
            value={customFigure}
            onChange={handleCustomChange}
            placeholder="请输入您想要合影的圣经人物..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
