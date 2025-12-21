import { useState, useRef, useEffect, use } from "react";
import { useAuthStore } from "../store/auth-store";

import { formatDate } from "../utils/date";
import { formatKey } from "../utils/formatKey";
import HomePage from "./HomePage";
import AppCard from "../components/AppCard";
import axios from "axios";
import {
	X,
	Moon,
	ShieldAlert,
	Copy,
	EyeOff,
	Eye,
	Check,
	Plus,
	LoaderCircle,
	TriangleAlert,
	KeyRound,
} from "lucide-react";
import { set } from "mongoose";
import { create } from "zustand";

const Dashboard = () => {
	const { isAuthenticated, user, isCheckingAuth, logout } = useAuthStore();

	const modalLayout = useRef(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [apps, setApps] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [userConfirmedClose, setUserConfirmedClose] = useState(false);
	const [appName, setAppName] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showKey, setShowKey] = useState(false);
	const handleLogout = () => {
		logout();
	};
	const getApps = async () => {
		try {
			const res = await axios.get("http://localhost:5000/apps/", {
				withCredentials: true,
			});
			setApps(res.data.apps);
			console.log(res.data.apps);
		} catch (err) {
			console.log(err);
		}
	};

	const createApp = async () => {
		try {
			setIsLoading(true);
			const res = await axios.post(
				"http://localhost:5000/apps/create-app",
				{ name: appName }, // ✅ this is the body
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true, // ✅ send cookies along
				}
			);

			setApiKey(res.data.app.apiKey);
			setIsLoading(false);
			console.log("api key", res.data.app.apiKey);
		} catch (err) {
			setIsLoading(false);

			setError(err.response.data.message);
			console.log("error : ", error);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!appName) return;
		if (!apiKey && !isLoading) createApp();
		if (apiKey && !isLoading) {
			setUserConfirmedClose(true);
		}
	};
	// useEffect(() => {
	// 	const handleClickOutside = (e) => {
	// 		if (modalLayout.current && !modalLayout.current.contains(e.target)) {
	// 			setModalOpen(false);
	// 			console.log("clicked outside");
	// 		}
	// 	};
	// 	document.addEventListener("mousedown", handleClickOutside);
	// 	return () => {
	// 		document.removeEventListener("mousedown", handleClickOutside);
	// 	};
	// }, []);
	useEffect(() => {
		console.log("modalOpen -", modalOpen);
		console.log("ConfirmationModalOpen- ", confirmModalOpen);
	}, [modalOpen, confirmModalOpen]);

	useEffect(() => {
		getApps();
	}, []);

	useEffect(() => {
		if (userConfirmedClose) {
			// reset states
			setConfirmModalOpen(false);
			setModalOpen(false);
			setAppName("");
			setApiKey("");
			setShowKey(true);
		}
	}, [userConfirmedClose]);

	useEffect(() => {
		if (!modalOpen && apiKey) {
			setConfirmModalOpen(true);
		}
	}, [modalOpen, apiKey]);

	if (!isAuthenticated) {
		return <HomePage />;
	}

	return (
		<div className=" mt-24 w-[90%]  p-7 bg-gray-900 bg-opacity-80 rounded-xl select-none overflow-hidden">
			{/* top bar */}
			<div className="flex justify-center items-center  gap-4 mb-10 ">
				{/* My Apps Title*/}
				<div className="text-3xl font-bold  bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
					My Apps
				</div>

				{/* Add App Button */}
				<div
					className=" cursor-pointer active:scale-[0.99] text-black font-semibold rounded-sm p-2 bg-gradient-to-r from-green-400 to-emerald-600"
					onClick={() => setModalOpen(true)}
				>
					<Plus />
				</div>

				{/* Black Layout */}
				{(modalOpen || confirmModalOpen) && (
					<div className="absolute border-1  inset-0 bg-black/70 backdrop-blur-md pt-50 px-6 ">
						<div className="relative flex flex-col justify-center items-center ">
							{/* ----- */}

							{/* confirmation to close modal */}
							{confirmModalOpen && (
								<div className="bg-gradient-to-r from-green-400/60 to-green-950 rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all">
									<div className="flex items-center gap-2 mb-4">
										<TriangleAlert color="yellow" />

										<h2 className="text-xl font-bold text-gray-200">
											Have you saved your API key?
										</h2>
									</div>

									<p className=" text-gray-200 mb-6">
										Make sure you've copied your API key. You won't be able to
										see it again after closing this window.
									</p>

									<div className="flex gap-3">
										<button
											onClick={() => {
												setUserConfirmedClose(false);
												setConfirmModalOpen(false);
												setModalOpen(true);
											}}
											className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
										>
											Go back
										</button>
										<button
											onClick={() => setUserConfirmedClose(true)}
											className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
										>
											I've Saved My Key
										</button>
									</div>
								</div>
							)}

							{/* form for creating an app */}
							{modalOpen && (
								<form
									ref={modalLayout}
									onSubmit={handleSubmit}
									className="overflow-hidden w-2xl rounded-lg max-w-3xl  relative bg-gradient-to-r from-green-400/60 to-green-950 p-6 pt-8  flex flex-col justify-center  gap-8"
								>
									<div className="bg-green-700 absolute top-0 left-0 right-0 py-4 px-4 flex items-center justify-between">
										<div className="text-2xl text-gray-100 font-semibold">
											Generate API Key
										</div>
										<X
											className=" text-gray-300/80 hover:text-gray-200 cursor-pointer transition-colors duration-200"
											onClick={() => setModalOpen(false)}
										/>
									</div>

									<div className="flex flex-col  items-start gap-2 mt-14 ">
										<div className="font-semibold text-lg text-gray-200">
											App Name
										</div>

										<div className="w-full">
											<input
												required
												disabled={apiKey}
												type="text"
												name="app-name"
												placeholder="My application . . ."
												className=" bg-green-950 px-4 py-2 rounded-md shadow-sm shadow-black focus:outline-none focus:ring-1 focus:ring-green-800 text-gray-300 text-md text-start w-full"
												onChange={(e) => setAppName(e.target.value)}
												value={appName}
											/>
											{error && appName && (
												<div className="flex mt-2">
													<TriangleAlert color="yellow" />
													<span className=" text-yellow-500  ml-2">
														{error}
													</span>
												</div>
											)}
										</div>
									</div>

									{apiKey && (
										<div className="flex flex-col items-start gap-2 ">
											<div className="font-semibold text-lg text-gray-200">
												Your API KEY
											</div>
											<div className=" flex flex-col gap-4 border-1 bg-green-950 rounded-lg  p-5">
												{/* key display and actions */}
												<div className="flex  justify-start items-center gap-5">
													<div className=" flex-1 italic break-all text-white/90   p-3 rounded-md bg-green-800 shadow-md shadow-black/30">
														{showKey ? apiKey : formatKey(apiKey)}
													</div>
													<div className="flex items-center gap-5 text-white/80 hover:cursor-pointer">
														{copied ? (
															<div className="relative bg-green-900 p-2 shadow-lg rounded-md brightness-130 transition-all duration-300">
																<div className="-top-8 left-1/2 -translate-x-1/2 absolute bg-black/40 text-white p-1 rounded-sm text-xs  whitespace-nowrap ">
																	Copied!
																</div>
																<Check size={20} />
															</div>
														) : (
															<div
																className="relative group bg-green-900 p-2 shadow-lg rounded-md hover:brightness-130 transition-all duration-300"
																onClick={() => {
																	navigator.clipboard.writeText(apiKey);
																	setCopied(true);
																	setTimeout(() => setCopied(false), 2000);
																}}
															>
																<Copy size={20} />
																<div className="-top-8 left-1/2 -translate-x-1/2 absolute bg-black/40 text-white p-1 px-2 rounded-sm text-xs invisible group-hover:visible whitespace-nowrap ">
																	Copy
																</div>
															</div>
														)}

														<div
															className="relative group bg-green-900 p-2 shadow-lg rounded-md hover:brightness-130 transition-all duration-300"
															onClick={() => setShowKey(!showKey)}
														>
															<div className="-top-8 left-1/2 -translate-x-1/2 absolute bg-black/40 text-white p-1 px-2 rounded-sm text-xs invisible group-hover:visible whitespace-nowrap ">
																{showKey ? "hide key" : "show key"}
															</div>
															{showKey ? (
																<EyeOff size={20} />
															) : (
																<Eye size={20} />
															)}
														</div>
													</div>
												</div>

												<div className="flex  text-white  gap-2  ">
													<TriangleAlert className="text-yellow-400" />
													<div className="text-md  text-gray-400 text-start">
														Make sure to store it somewhere safe. You won't be
														able to see it again once you close this window.
													</div>
												</div>
											</div>
										</div>
									)}

									<button
										type="submit"
										disabled={!appName}
										className={`${
											!appName
												? "cursor-not-allowed opacity-60"
												: "cursor-pointer hover:brightness-110 "
										} flex gap-2 justify-center items-center mx-auto active:scale-[0.99] font-semibold shadow-green-600 rounded-sm px-4 py-1.5 bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-300`}
									>
										{isLoading ? (
											<div className="flex items-center gap-2">
												<span className="text-lg ">Creating</span>
												<LoaderCircle />
											</div>
										) : apiKey ? (
											<div className="flex items-center gap-2 hover:brightness-100">
												<span className="text-lg ">Done</span>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<span className="text-lg ">Create</span>
												<KeyRound />
											</div>
										)}
									</button>
								</form>
							)}
						</div>
					</div>
				)}
			</div>

			{/* apps grid */}
			{apps.length === 0 ? (
				<div className=" flex flex-col justify-center items-center p-5 rounded-md text-gray-200 italic font-semibold">
					<Moon size={40} />
					<div className=" text-xl">No apps found. Create your first app!</div>
				</div>
			) : (
				<div className="flex flex-wrap gap-6 justify-center  ">
					{/* App Card */}
					{apps.map((app) => (
						<div key={app._id} className="w-lg">
							<AppCard
								appTitle={app.name}
								appSate={app.status}
								creationDate={formatDate(app.createdAt)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
export default Dashboard;
