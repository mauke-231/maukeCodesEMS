import { useState } from 'react';

export default function CategoryFilter({ onCategoryChange }) {
    const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Technical', 'Other'];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        onCategoryChange(category);
    };

    return (
        <div className="flex gap-4 mb-6">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded ${
                        selectedCategory === category 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
} 