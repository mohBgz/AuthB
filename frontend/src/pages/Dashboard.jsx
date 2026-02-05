import { useState, useRef, useEffect, use } from "react";
import { useAuthStore } from "../store/auth-store";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "../utils/motionVariants";
import { formatDate } from "../utils/date";
import { formatKey } from "../utils/formatKey";
import HomePage from "./HomePage";
import AppCard from "../components/AppCard";
import axios from "axios";
import toast from "react-hot-toast";

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
	Circle,
} from "lucide-react";

const Dashboard = () => {
	const API_URL = "http://localhost:5000/api/dashboard/apps";
	const { isAuthenticated, logout, getApps, isLoadingApps, apps, createApp, deleteApp, appError, setAppError } =
		useAuthStore();

	const modalLayout = useRef(null);
	const [confirmValue, setConfirmValue] = useState(""); // Delete input
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	//const [apps, setApps] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const [app, setApp] = useState({ name: "", id: "", key: "" });

	//const [appName, setAppName] = useState("");
	//const [apiKey, setApiKey] = useState("");

	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	//const [error, setError] = useState("");
	const [showKey, setShowKey] = useState(false);
	const [appsPerPage, setAppsPerPage] = useState(6);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [newAppId, setNewAppId] = useState(null);

	const handleLogout = () => {
		logout();
	};
	// const getApps = async () => {
	// 	try {
	// 		const res = await axios.get(API_URL, {
	// 			withCredentials: true,
	// 		});
	// 		setApps(res.data.apps);
	// 	} catch (err) {
	// 		if (err.response?.status === 401) {
	// 			try {
	// 				await axios.get("http://localhost:5000/api/dashboard/refresh-token", {
	// 					withCredentials: true,
	// 				});

	// 				const retryRes = await axios.get(API_URL, {
	// 					withCredentials: true,
	// 				});
	// 				setApps(retryRes.data.apps);
	// 			} catch (refreshErr) {
	// 				toast.error("Session expired. Please log in again.");
	// 				handleLogout();
	// 			}
	// 		} else {
	// 			console.log(err);
	// 		}
	// 	}
	// };

	// const createApp = async () => {
	// 	try {
	// 		setIsLoading(true);
	// 		const res = await axios.post(
	// 			`${API_URL}/create-app`,
	// 			{ name: app.name }, // ✅ this is the body
	// 			{
	// 				headers: { "Content-Type": "application/json" },
	// 				withCredentials: true, // ✅ send cookies along
	// 			},
	// 		);
	// 		//setApiKey(res.data.apiKey);
	// 		setApp((prev) => ({ ...prev, key: res.data.apiKey }));
	// 		setNewAppId(res.data.app._id);

	// 		await getApps();

	// 		setIsLoading(false);
	// 		console.log("api key", res.data.app.apiKey);
	// 	} catch (err) {
	// 		setIsLoading(false);

	// 		setError(err.response.data.message);
	// 		console.log("error : ", error);
	// 	}
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		//setUserConfirmedClose(false);
		if (!app.name) return;
		if (!app.key && !isLoadingApps) {
			try {
				const newApp = await createApp(app.name);
				console.log("newApp", newApp);
				setApp((prev) => ({ ...prev, key: newApp.apiKey }));
				setNewAppId(newApp._id); // for highlighting
				await getApps();
			} catch (err) {
				console.error(err);
			}
		}
		if (app.key && !isLoadingApps) {
			setModalOpen(false);
			setConfirmModalOpen(true);
		}
	};

	// const deleteApp = async (appId) => {
	// 	try {
	// 		setIsLoading(true);
	// 		console.log("deleting app with id:", appId);
	// 		const deletedApp = await axios.delete(
	// 			`${API_URL}/${app.id}`,
	// 			{ appId },
	// 			{
	// 				headers: { "Content-Type": "application/json" },
	// 				withCredentials: true, // ✅ send cookies along
	// 			},
	// 		);

	// 		setIsLoading(false);
	// 	} catch (error) {
	// 		console.error(error);
	// 		setIsLoading(false);
	// 	}
	// };
	useEffect(() => {
		setTotalPages(Math.ceil(apps.length / appsPerPage));
	}, [apps, appsPerPage]);
	useEffect(() => {
		if (!modalOpen && !confirmModalOpen && !deleteModalOpen) {
			setApp("", "", "");
			setConfirmValue("");
		}
	}, [modalOpen, confirmModalOpen, deleteModalOpen]);

	// useEffect(() => {
	// 	console.log("totalPages", totalPages);
	// 	console.log("appsPerPage", appsPerPage);
	// 	console.log(" Apps :", apps.length);
	// }, [totalPages]);
	// useEffect(() => {
	// 	console.log("current Page ", currentPage);
	// }, [currentPage]);
	// useEffect(() => {
	// 	console.log("modalOpen -", modalOpen);
	// 	console.log("ConfirmationModalOpen- ", confirmModalOpen);
	// }, [modalOpen, confirmModalOpen]);

	useEffect(() => {
		getApps();
	}, []);

	// useEffect(() => {
	// 	if (userConfirmedClose) {
	// 		// reset states

	// 		setConfirmModalOpen(false);
	// 		setModalOpen(false);
	// 		setAppName("");
	// 		setApiKey("");
	// 		setShowKey(true);

	// 	}
	// }, [userConfirmedClose]);

	// useEffect(() => {
	// 	if (!modalOpen && apiKey) {
	// 		setConfirmModalOpen(true);
	// 	}
	// }, [modalOpen, apiKey]);

	if (!isAuthenticated) {
		return <HomePage />;
	}

	return (
		<div className=" mt-24  w-full md:w-[90%]  py-7 px-0 bg-gray-900  md:rounded-xl select-none overflow-hidden">
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
				{(modalOpen || confirmModalOpen || deleteModalOpen) && (
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
												// setUserConfirmedClose(false);
												setConfirmModalOpen(false);
												setModalOpen(true);
											}}
											className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
										>
											Go back
										</button>
										<button
											// onClick={() => setUserConfirmedClose(true)}
											onClick={() => {
												setConfirmModalOpen(false);
												//setApiKey("");
												//setAppName("");

												setApp((prev) => ({ ...prev, name: "", key: "" }));
											}}
											className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
										>
											I've Saved My Key
										</button>
									</div>
								</div>
							)}

							{/* confirmation to delete an app*/}
							{deleteModalOpen && (
								<div className="space-y-6 bg-gradient-to-r from-green-400/60 to-green-950 rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all">
									{/* Header */}
									<div className="flex items-center gap-2">
										<TriangleAlert color="yellow" />

										<h2 className="text-xl font-bold text-gray-200">
											Delete App
										</h2>
									</div>

									{/* 2 text + input */}
									<div className="space-y-4">
										{/* first text */}
										<p className=" font-semibold text-gray-200 ">
											You are about to delete "
											<span className="text-gray-100 font-bold">
												{app.name}
											</span>
											". This action cannot be undone.
										</p>

										{/* 2nd text  + input*/}
										<div className="space-y-2 ">
											<p className=" font-normal text-gray-200 ">
												Please type
												<span className="select-text mx-1 text-gray-100 font-mono bg-green-900 py-1 px-2 shadow-md rounded-sm">
													{app.name}
												</span>
												To confirm This action.
											</p>
											<input
												type="text"
												placeholder="Enter App Name"
												className=" bg-green-950 px-4 py-2 rounded-md shadow-sm shadow-black focus:outline-none focus:ring-1 focus:ring-green-800 text-gray-300 text-md text-start w-full"
												onChange={(e) => setConfirmValue(e.target.value)}
												value={confirmValue}
											/>
										</div>

										{/* buttons */}
										<div className="flex gap-3">
											<button
												onClick={() => {
													// setUserConfirmedClose(false);
													setDeleteModalOpen(false);
													// setApiKey("");
													// setAppName("");
													setApp((prev) => ({ ...prev, name: "", key: "" }));
												}}
												className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
											>
												Go back
											</button>
											<button
												type="button"
												onClick={async (e) => {
													console.log("lol");
													e.preventDefault();
													await deleteApp(app.id);
													setDeleteModalOpen(false);
													await getApps();
												}}
												disabled={confirmValue !== app.name || isLoading}
												className="text-center disabled:cursor-not-allowed  flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
											>
												{isLoading ? (
													<LoaderCircle className="mx-auto animate-spin" />
												) : (
													"Confirm Delete"
												)}
											</button>
										</div>
									</div>
								</div>
							)}

							{/* form for creating an app */}
							{modalOpen && (
								<form
									ref={modalLayout}
									onSubmit={handleSubmit}
									className=" overflow-hidden min-w-md w-[90%] md:w-[70%] max-w-xl rounded-lg   relative bg-gradient-to-r from-green-400/60 to-green-950 p-6 pt-8  flex flex-col justify-center  gap-8"
								>
									<div className="bg-green-700 absolute top-0 left-0 right-0 py-4 px-4 flex items-center justify-between">
										<div className="text-nowrap text-2xl text-gray-100 font-semibold">
											Generate API Key
										</div>
										<X
											className=" text-gray-300/80 hover:text-gray-200 cursor-pointer transition-colors duration-200"
											onClick={() => {
												setModalOpen(false);
												if (app.key) setConfirmModalOpen(true);
											}}
										/>
									</div>

									<div className="flex flex-col  items-start gap-2 mt-14 ">
										<div className="font-semibold text-lg text-gray-200">
											App Name
										</div>

										<div className="w-full">
											<input
												required
												disabled={app.key}
												type="text"
												name="app-name"
												placeholder="Application name"
												className=" bg-green-950 px-4 py-2 rounded-md shadow-sm shadow-black focus:outline-none focus:ring-1 focus:ring-green-800 text-gray-300 text-md text-start w-full"
												onChange={(e) => {
													setApp((prev) => ({
														...prev,
														name: e.target.value.trim(),
													}));

													//setAppName(e.target.value.trim());
													setAppError("");
												}}
												value={app.name || ""}
											/>
											{appError && app.name && (
												<div className="flex mt-2">
													<TriangleAlert color="yellow" />
													<span className=" text-yellow-500  ml-2">
														{appError}
													</span>
												</div>
											)}
										</div>
									</div>

									{app.key && (
										<div className="flex flex-col items-start gap-2 ">
											<div className="font-semibold text-lg text-gray-200">
												Your API KEY
											</div>
											<motion.div
												variants={itemVariants}
												animate="highlightInput"
												className=" flex flex-col gap-4 bg-gray-900/70  rounded-lg  p-5"
											>
												{/* key display and actions */}
												<div className="flex  justify-start items-center gap-5">
													<div className=" flex-1 italic break-all text-white/90   p-3 rounded-md bg-green-800 shadow-md shadow-black/30">
														{showKey ? app.key : formatKey(app.key)}
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
																	navigator.clipboard.writeText(app.key);
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

												<div className="flex  items-center  gap-4  ">
													<TriangleAlert className="text-yellow-400 flex-shrink-0" />
													<div className="text-md  text-gray-400 text-start">
														Make sure to store it somewhere safe. You won't be
														able to see it again once you close this window.
													</div>
												</div>
											</motion.div>
										</div>
									)}

									<button
										type="submit"
										disabled={!app.name}
										className="action-button w-[30%] mx-auto mb-0"
									>
										{isLoading ? (
											<div className="flex justify-center items-center gap-2">
												<LoaderCircle />
											</div>
										) : app.key ? (
											<div className="flex justify-center items-center gap-2 hover:brightness-100">
												<span className="text-lg ">Close</span>
											</div>
										) : (
											<div className="flex justify-center items-center gap-1">
												<span className="text-lg ">Create</span>
												<Plus size={18} />
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
			) : !modalOpen && !confirmModalOpen ? (
				<div className="space-y-4">
					<motion.div
						key={currentPage}
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className=" flex flex-wrap gap-3 md:gap-6 min-h-[406px] justify-center  "
					>
						<AnimatePresence initial={false}>
							{/* App Card */}
							{apps
								.slice(
									(currentPage - 1) * appsPerPage,
									currentPage * appsPerPage,
								)
								.map((app) => (
									<motion.div
										key={app._id}
										className={`w-md  h-fit overflow-hidden rounded-md hover:shadow-md hover:shadow-green-900 duration-300 transition-all`}
										variants={itemVariants}
										initial="hidden"
										animate={
											newAppId === app._id ? ["highlightItem", "show"] : "show"
										}
										exit="exit"
									>
										<AppCard
											appTitle={app.name}
											appSate={app.status}
											appId={app._id}
											creationDate={formatDate(app.createdAt)}
											setApp={setApp}
											setDeleteModalOpen={setDeleteModalOpen}
										/>
									</motion.div>
								))}
						</AnimatePresence>
					</motion.div>

					<div className="flex text-gray-400 gap-2 justify-center ">
						<button
							className="  underline-offset-2 underline decoration-gray-600"
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							{"<Previous"}
						</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
							<div
								className={`cursor-pointer py-0.5 px-1.5 ${
									num === currentPage
										? " bg-green-800  rounded-sm text-white"
										: ""
								}`}
								key={num}
								onClick={() => {
									setCurrentPage(num);
								}}
							>
								{num}
							</div>
						))}
						<button
							className="disa underline-offset-2 underline decoration-gray-600"
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							{"Next>"}
						</button>
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
};
export default Dashboard;
