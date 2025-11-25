import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'; // Using lucide-react for icons

// Main component, must be named App and exported default
const App = () => {
  const totalSteps = 6;
  const currentStep = 5;
  const stepTitles = [
    "Service Selection",
    "Personal Info",
    "Professional Details",
    "Documents",
    "Service Area & Pricing",
    "Review & Submit"
  ];

  // State for Service Areas (tags)
  const [serviceAreas, setServiceAreas] = useState(['bangalore']);
  const [newArea, setNewArea] = useState('');
  
  // State for Pricing
  const [hourlyRate, setHourlyRate] = useState('');
  const [fixedRate, setFixedRate] = useState('');
  
  // State for Availability Checkboxes
  const initialAvailability = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };
  const [availability, setAvailability] = useState(initialAvailability);

  // --- Handlers for Service Areas ---
  const handleAddArea = () => {
    const areaToAdd = newArea.trim().toLowerCase();
    if (areaToAdd && !serviceAreas.includes(areaToAdd)) {
      setServiceAreas([...serviceAreas, areaToAdd]);
      setNewArea('');
    }
  };

  const handleRemoveArea = useCallback((area) => {
    setServiceAreas(serviceAreas.filter(a => a !== area));
  }, [serviceAreas]);

  const handleAreaInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddArea();
    }
  };

  // --- Handlers for Availability ---
  const handleAvailabilityChange = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const isNextDisabled = serviceAreas.length === 0 || 
                         (Object.values(availability).every(v => v === false));

  // --- Stepper Component (Inline) ---
  const Stepper = () => {
    const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
      <div className="mb-10 w-full">
        <div className="flex justify-between relative">
          {stepTitles.map((title, index) => {
            const step = index + 1;
            const isCompleted = step < currentStep;
            const isActive = step === currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center z-10 w-1/6">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    transition-colors duration-300 mb-2
                    ${isCompleted ? 'bg-indigo-600' : 
                      isActive ? 'bg-indigo-600 text-white' : 
                      'bg-gray-200 text-gray-500'}
                  `}
                >
                  {isCompleted ? <Check size={16} className="text-white" /> : step}
                </div>
                <div 
                  className={`text-center text-xs font-medium 
                    ${isActive ? 'text-indigo-600' : 'text-gray-500'}
                  `}
                >
                  {title}
                </div>
              </div>
            );
          })}
        </div>
        {/* Progress Bar Track */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-full mt-4">
          {/* Active Progress */}
          <div 
            className="h-1 bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // --- Availability Checkbox Component (Inline) ---
  const CheckboxItem = ({ day, checked, onChange }) => (
    <label className="flex items-center text-gray-700 cursor-pointer w-full sm:w-1/2 lg:w-1/4">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(day)}
        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
      />
      <span className="ml-2 text-sm font-medium">{day}</span>
    </label>
  );


  // --- Rendered JSX ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-4xl">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
          Partner Registration
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Step {currentStep} of {totalSteps}: Service Area & Pricing
        </p>

        {/* Stepper Display */}
        <div className="relative pt-1">
          <Stepper />
        </div>

        {/* Form Content */}
        <div className="space-y-8 mt-16">
          
          {/* 1. Service Areas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Areas <span className="text-red-500">*</span> (Add at least one)
            </label>
            <div className="flex flex-wrap items-center space-x-2 mb-3">
              {serviceAreas.map(area => (
                <div 
                  key={area} 
                  className="flex items-center bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-2"
                >
                  {area}
                  <button 
                    onClick={() => handleRemoveArea(area)} 
                    className="ml-2 text-indigo-700 hover:text-indigo-900 focus:outline-none"
                    aria-label={`Remove ${area}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex w-full">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={handleAreaInputKeyDown}
                placeholder="Enter area/locality"
                className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
              <button
                onClick={handleAddArea}
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-r-lg shadow-md transition duration-150"
              >
                Add
              </button>
            </div>
            {serviceAreas.length === 0 && (
                <p className="text-red-500 text-xs mt-1">Please add at least one service area.</p>
            )}
          </div>

          {/* 2. Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-semibold text-gray-700 mb-2">
                Hourly Rate (<span className="font-sans">₹</span>)
              </label>
              <input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="Enter hourly rate"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>
            <div>
              <label htmlFor="fixedRate" className="block text-sm font-semibold text-gray-700 mb-2">
                Fixed Rate (<span className="font-sans">₹</span>)
              </label>
              <input
                id="fixedRate"
                type="number"
                value={fixedRate}
                onChange={(e) => setFixedRate(e.target.value)}
                placeholder="Enter fixed rate"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>
          </div>

          {/* 3. Availability */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Availability <span className="text-red-500">*</span> (Select days)
            </label>
            <div className="flex flex-wrap gap-4">
              {Object.keys(initialAvailability).map(day => (
                <CheckboxItem
                  key={day}
                  day={day}
                  checked={availability[day]}
                  onChange={handleAvailabilityChange}
                />
              ))}
            </div>
            {(Object.values(availability).every(v => v === false)) && (
                <p className="text-red-500 text-xs mt-2">Please select at least one day.</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
          <button
            onClick={() => console.log('Go to Previous Step')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium py-2 px-4 rounded-lg transition duration-150"
          >
            <ChevronLeft size={20} className="mr-1" />
            Previous
          </button>
          
          <button
            onClick={() => console.log('Go to Next Step')}
            disabled={isNextDisabled}
            className={`flex items-center font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300 
              ${isNextDisabled 
                ? 'bg-indigo-300 text-white cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;