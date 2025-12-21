import React, { useEffect } from "react";

const PasswordCriteria = ({ criteria }) => {
  // {password:123} objct destructuring

  return criteria.map((item) => {
    const criteriaMet = item.met;
    return (
      <div
        key={item.label}
        className={`flex justify-start gap-8 transition-colors duration-500 ${
          criteriaMet ? "text-green-600" : "text-white/20"
        }`}
      >
        <div className="w-1.5 font-semibold ">{criteriaMet ? "✓" : "✗"}</div>
        <div className="text-[1.08rem]">{item.label}</div>
      </div>
    );
  });
};

const PasswordStrengthMeter = ({ className, password, setScore }) => {

 
  useEffect(() => {

    setScore(getPassorwdStrength().score);
  }, [password]);

  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Includes an uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Includes a lowercase letter", met: /[a-z]/.test(password) },
    { label: "Includes a number", met: /\d/.test(password) },
    {
      label: "Includes a special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const getPassorwdStrength = () => {
    const score = criteria.filter((item) => item.met).length; // score = ( 0-->  5 ) how many criteria are met

    // based on score

    // Very weak === socre = ( 0-1 )
    // Weak === socre = (2)
    // Fair ===  socre = (3)
    // Strong === socre = (4)
    // Very Strong  ===  socre = (5)

    // input => score || output =>   {strength : "Weak" , color : "red"  }

    let strength;
    let color;
    if (score === 0 || score === 1) {
      strength = "Very weak";
      color = "bg-white/20";
    }
    if (score === 2) {
      strength = "Weak";
      color = "bg-red-400";
    }
    if (score === 3) {
      strength = "Fair";
      color = "bg-orange-400";
    }
    if (score === 4) {
      strength = "Strong";
      color = "bg-lime-400";
    }
    if (score === 5) {
      strength = "Very strong";
      color = "bg-green-400";
    }

    /// console.log({ strength, color });
    return { score, strength, color };
  };

  return (
    <div
      className={`${className} flex flex-col items-start w-full px-4 gap-1 text-white/20 select-none`}
    >
      <div className="flex flex-col w-full">
        <div className="flex text-[1.09rem]">
          <div className="flex-1 text-start">Password strength</div>
          <div>{getPassorwdStrength().strength}</div>
          <div></div>
        </div>

        {/* progress-bar */}
        <div className="flex gap-1 mt-1 mb-4">
          {[1, 2, 3, 4].map((i) => {
            return (
              <div
                key={i}
                className={`h-1 flex-1/4 rounded-lg ${
                  getPassorwdStrength().score > i
                    ? getPassorwdStrength().color
                    : "bg-white/30"
                }`}
              ></div>
            );
          })}
        </div>

        {/* 
  🧠    Password Strength Progress Bar Logic:

          - The goal is to visualize how strong the password is by filling a series of colored blocks.
          - We define a score (0 to 5) by checking how many criteria are met.
          - Then we render 4 blocks, and for each block, we ask:
              --> "Is the current score greater than this block's index?"
          - If yes → fill the block with the current strength color (green/orange/red/etc.)
          - If not → render it as a faded/gray block.
      */}

        {/* ---- */}
      </div>
      <PasswordCriteria criteria={criteria} />
    </div>
  );
};

export default PasswordStrengthMeter;
