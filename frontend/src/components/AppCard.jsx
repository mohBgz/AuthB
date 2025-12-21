import React from "react";
import { Copy, Eye, EyeOff } from "lucide-react";

const AppCard = ({appTitle, appSate, creationDate}) => {
  return (
    <div className=" w-full font-semibold bg-gray-700/60 rounded-md p-6 border-t-2 border-green-500 space-y-6">
      <div>
        <div className="text-2xl  mb-4 text-gray-300">{appTitle}</div>
      </div>

      <div className="w-full flex items-center gap-3 text-green-700 px-3 py-1 bg-gray-700 rounded-full">
        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
        <div>{appSate}</div>
      </div>

      <div className="w-full bg-gray-800 p-5 rounded-lg text-lg space-y-10 text-green-500 ">
        {/* row : apikey --- value */}
        <div >
          <div className="flex gap-2 items-center justify-between">
            <div>API Key</div>
            <div className="flex gap-2">
              <EyeOff width={18} />
              <Copy width={18} />
            </div>
          </div>

          <div className="bg-green-900 py-1 px-4 text-gray-300 rounded-lg mt-2">
            <div className="text-sm">X_456Lm@j,ff3"#_jKL</div>
          </div>
        </div>

        {/* row : Created --- 1/15/2024 */}
        <div className="flex justify-between items-center text-md">
          <div>Created</div>
          <div>{creationDate}</div>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
