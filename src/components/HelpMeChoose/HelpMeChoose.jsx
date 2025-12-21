"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {
  User,
  Baby,
  Gift,
  Citrus,
  Candy,
  HelpCircle,
  Star,
  Heart,
  Shield,
  Droplets,
  Flame,
  Coffee,
  Zap,
  Users,
} from "lucide-react";

const steps = [
  {
    id: 1,
    label: "age",
    question: "Age Group ",
    options: [
      {icon: <Baby size={20} />, label: "Below Teen"},
      {icon: <User size={20} />, label: "13 to 25"},
      {icon: <Users size={20} />, label: "25 to 40"},
      {icon: <Star size={20} />, label: "40 plus"},
    ],
  },
  {
    id: 2,
    label: "health",
    question: "Health Benefits are you looking for  ",
    options: [
      {icon: <Shield size={20} />, label: "Immunity Booster"},
      {icon: <Zap size={20} />, label: "Digestives"},
      {icon: <Flame size={20} />, label: "Bloating"},
      {icon: <Heart size={20} />, label: "Mukhwas"},
    ],
  },
  {
    id: 3,
    label: "flavor",
    question: "Flavors You are looking for ",
    options: [
      {icon: <Candy size={20} />, label: "Sweet"},
      {icon: <Coffee size={20} />, label: "Khata Mitha"},
      {icon: <Droplets size={20} />, label: "Paan and Mint"},
      {icon: <Citrus size={20} />, label: "Tangy"},
    ],
  },
  {
    id: 4,
    label: "result",
    question: "Review your selection",
  },
];

const helpContent = {
  age: {
    title: "Select Your Age Group",
    tips: [
      "Below Teen: Light and gentle ingredients suit developing taste",
      "13 to 25: Bold and trendy flavors match youthful preferences.",
      "25 to 40: Balanced blends support busy lifestyle and digestion",
      "40 plus: Mild, gut-friendly options work best with slow metabolism.",
    ],
  },

  health: {
    title: "Choose Your Health Benefit",
    tips: [
      "Immunity Booster: Look for vitamin C, zinc, and antioxidants",
      "Digestives: Probiotics and fiber-rich options work best",
      "Bloating: Anti-inflammatory ingredients help reduce discomfort",
      "Mukhwas: Natural mouth fresheners improve digestion after meals",
    ],
  },

  flavor: {
    title: "Pick Your Preferred Flavor",
    tips: [
      "Sweet: Perfect for those who enjoy mild and sugary tastes",
      "Khata Mitha: A balanced mix of sweet and tangy flavors",
      "Paan and Mint: Cooling and refreshing for long-lasting freshness",
      "Tangy: Sharp and zesty flavors for a bold taste experience",
    ],
  },
};

export default function MukhwasWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const router = useRouter();

  const currentStep = steps[stepIndex];
  const currentHelp = helpContent[currentStep.label];

  const handleSelect = (label) => {
    setAnswers((prev) => ({...prev, [currentStep.label]: label}));
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      const query = new URLSearchParams({
        age: answers.age || "",
        health: answers.health || "",
        flavor: answers.flavor || "",
      }).toString();

      router.push(`/products?${query}`);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const isSelected = (label) => answers[currentStep.label] === label;

  const getIconByLabel = (stepLabel, answerLabel) => {
    const step = steps.find((s) => s.label === stepLabel);
    const option = step?.options?.find((opt) => opt.label === answerLabel);
    return option?.icon || null;
  };

  return (
    <div className=" pt-16 pb-20 bg-[#CEFAFE] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl m-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-indigo-900 mb-4">
            Personalise Your Selection
          </h2>
          <p className="text-lg text-teal-700 max-w-2xl mx-auto">
            Discover products perfectly matched to your specific requirements
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch bg-white rounded-2xl  overflow-hidden border-l-4 border-teal-400">
          {/* Left - Help Box */}
          <div className="">
            <div className="p-4 sm:p-6 bg-teal-50  h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="text-teal-600" size={24} />
                  <h3 className="text-lg sm:text-xl font-bold text-indigo-900">
                    Help Me Choose
                  </h3>
                </div>

                {currentStep.label === "result" ? (
                  <div className="flex items-center gap-4 justify-center py-4">
                    <div className=" h-20 flex items-center gap-1 text-sm text-indigo-900 bg-teal-200 p-1 rounded-2xl px-4">
                      {getIconByLabel("age", answers.age)}{" "}
                      <span>{answers.age}</span>
                    </div>
                    <div className=" h-20  flex items-center gap-1 text-sm text-indigo-900 bg-teal-200 p-1 rounded-2xl  px-4">
                      {getIconByLabel("health", answers.health)}{" "}
                      <span>{answers.health}</span>
                    </div>
                    <div className="h-20 rounded-2xl flex items-center gap-1 text-sm text-indigo-900 bg-teal-200 p-1 px-4">
                      {getIconByLabel("flavor", answers.flavor)}{" "}
                      <span>{answers.flavor}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-teal-50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                        <Star size={16} className="text-teal-600" />
                        {currentHelp.title}
                      </h4>
                      <ul className="space-y-2">
                        {currentHelp.tips.map((tip, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <Heart size={12} className="text-pink-500 mt-1" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-teal-100 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">
                    💡 Pro Tip
                  </h4>
                  <p className="text-sm text-gray-700">
                    {stepIndex === 0 &&
                      "Select your age group to help us recommend products suited to your body's needs."}
                    {stepIndex === 1 &&
                      "Choose the health benefit you want to focus on — immunity, digestion, bloating, or mukhwas."}
                    {stepIndex === 2 &&
                      "Pick a flavor that excites your taste buds — sweet, khatta meetha, paan & mint, or tangy."}
                    {stepIndex === 3 && (
                      <div className="space-y-2">
                        <p>Your choices are great! 🎉</p>
                        <p>
                          You've crafted a delicious combo tailored just for
                          you.
                        </p>
                      </div>
                    )}
                  </p>
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Step {stepIndex + 1} of {steps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Wizard */}
          <div className="">
            <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6 text-center">
                  Craft Your Personalised Wellness Story
                </h2>

                <div className="flex justify-between text-xs sm:text-sm mb-4 gap-1">
                  {steps.map((s, i) => (
                    <span
                      key={s.id}
                      className={`px-1 sm:px-2 py-1 rounded text-center flex-1 ${
                        i === stepIndex
                          ? "bg-teal-100 text-indigo-900 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      <span className="block sm:inline">{i + 1}.</span>
                      <span className="block sm:inline sm:ml-1">
                        {s.label.charAt(0).toUpperCase() + s.label.slice(1)}
                      </span>
                    </span>
                  ))}
                </div>

                <h3 className="text-base sm:text-lg font-medium text-indigo-900 mb-4 text-center">
                  {currentStep.question}
                </h3>

                {/* Options */}
                {currentStep.label !== "result" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-indigo-900">
                    {currentStep.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect(opt.label)}
                        className={`w-full flex items-center justify-center sm:justify-start gap-3 p-3 border rounded-lg text-left transition-transform duration-300 ease-in-out
                                                        ${
                                                          isSelected(opt.label)
                                                            ? "bg-[#CEFAFE] border-indigo-700 text-indigo-900"
                                                            : "hover:bg-[#CEFAFE] hover:scale-105 hover:shadow-md"
                                                        }
                                                        `}
                      >
                        <span className="text-lg sm:text-xl">{opt.icon}</span>
                        <span className="text-sm sm:text-base font-medium">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-indigo-50 rounded-lg p-4 mb-6 text-indigo-900 space-y-2 text-sm">
                    <p className="flex gap-2">
                      <strong>Age:</strong>
                      {getIconByLabel("age", answers.age)} {answers.age}
                    </p>
                    <p className="flex gap-2">
                      <strong>Health:</strong>{" "}
                      {getIconByLabel("health", answers.health)}
                      {answers.health}
                    </p>
                    <p className="flex gap-2">
                      <strong>Flavor:</strong>
                      {getIconByLabel("flavor", answers.flavor)}{" "}
                      {answers.flavor}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-3 mt-4">
                <button
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  className="px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    currentStep.label !== "result" &&
                    !answers[currentStep.label]
                  }
                  className="px-4 sm:px-6 py-2 bg-teal-200 text-indigo-900 rounded-full font-semibold hover:bg-teal-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  {stepIndex < steps.length - 1 ? "Next" : "Find My Flavor ❤️"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
