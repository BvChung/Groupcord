import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { refreshAccessToken } from "../features/authentication/authSlice";
import { axiosPrivate } from "./axios";

export default function useAxiosPrivate() {
	const dispatch = useDispatch();
	const { accessToken } = useSelector((state) => state.auth.user);

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${accessToken}`;
				}
				return config;
			},
			(err) => Promise.reject(err)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (err) => {
				const prevRequest = err?.config;
				if (err?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await dispatch(refreshAccessToken());
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

					return axiosPrivate(prevRequest);
				}
				return Promise.reject(err);
			}
		);
	}, [accessToken, refreshAccessToken]);

	return axiosPrivate;
}
