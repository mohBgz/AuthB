import React, { useState } from "react";
import { Trash2, CalendarDays, RotateCcw } from "lucide-react";

const AppCard = ({ appTitle, appSate, appId, creationDate, setApp, setDeleteModalOpen }) => {
	
	return (
		<div className=" overflow-hidden w-full h-full font-semibold bg-gray-700/60  rounded-md p-6  transition-all duration-300  space-y-6">
			<div className="flex justify-between">
				<div className="space-y-2">
					<div className=" text-2xl  text-gray-300">{appTitle}</div>
					{/* row : Created --- 1/15/2024 */}
					<div className="flex text-gray-400 gap-2 items-center text-sm">
						<CalendarDays size={18} />
						<div className=" ">Created</div>
						<div className="">{creationDate}</div>
					</div>
				</div>

				<div className="flex gap-2 items-center">
					<div className="flex items-center gap-2 text-green-700 px-3 py-1.5 bg-gray-700 border-gray-800 border-1 rounded-full">
						<div className="w-3 h-3 bg-green-600 rounded-full"></div>
						<div>{appSate}</div>
					</div>
					<button
						onClick={() => {
							setApp(prev => ({...prev, name: appTitle, id:appId }));
							
							
							setDeleteModalOpen(true);
							
						}}
					>
						<Trash2 className="text-gray-400 hover:text-red-800 hover:cursor-pointer transition-all duration-300" />
					</button>
				</div>
			</div>

			<div className="w-full bg-gray-800 p-5 rounded-lg  space-y-10 ">
				{/* row : apikey --- value */}
				<div>
					<div className="flex gap-4 justify-between items-center ">
						<div>
							<div className="text-green-600 text-md">API KEY</div>
							<div className="italic text-sm text-gray-500">
								Hidden for security
							</div>
						</div>

						<div className="flex  text-md gap-2 items-center font-semibold bg-green-900 hover:cursor-pointer py-1 px-4 rounded-lg group transition-all duration-300  ">
							<RotateCcw className="text-white/50 group-hover:text-gray-300 " />
							<div className="text-gray-400 group-hover:text-gray-300 transition-all duration-200">
								Regenerate Key
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppCard;
