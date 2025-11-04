import React from 'react';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
      isActive
        ? 'bg-accent text-primary shadow-md'
        : 'bg-surface text-secondary hover:bg-border hover:text-primary'
    }`}
  >
    {label}
  </button>
);

interface QuestFiltersProps {
  categories: string[];
  difficulties: string[];
  activeCategory: string;
  activeDifficulty: string;
  onCategoryChange: (category: string) => void;
  onDifficultyChange: (difficulty: string) => void;
}

const QuestFilters: React.FC<QuestFiltersProps> = ({
  categories,
  difficulties,
  activeCategory,
  activeDifficulty,
  onCategoryChange,
  onDifficultyChange,
}) => {
  return (
    <div className="bg-surface backdrop-blur-md border border-border rounded-xl p-4 mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <FilterButton
              key={category}
              label={category}
              isActive={activeCategory === category}
              onClick={() => onCategoryChange(category)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {difficulties.map(difficulty => (
            <FilterButton
              key={difficulty}
              label={difficulty}
              isActive={activeDifficulty === difficulty}
              onClick={() => onDifficultyChange(difficulty)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestFilters;
