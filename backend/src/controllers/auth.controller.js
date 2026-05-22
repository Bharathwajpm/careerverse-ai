import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";
import { setRefreshCookie, clearRefreshCookie } from "../utils/refreshCookie.js";

function sendAuthSuccess(res, status, { user, token, refreshRaw }) {
  setRefreshCookie(res, refreshRaw);
  res.status(status).json({
    success: true,
    data: { user, token, accessToken: token },
  });
}

export const register = asyncHandler(async (req, res) => {
  const bundle = await authService.registerUser(req.body, req);
  sendAuthSuccess(res, 201, bundle);
});

export const login = asyncHandler(async (req, res) => {
  const bundle = await authService.loginUser(req.body, req);
  sendAuthSuccess(res, 200, bundle);
});

export const google = asyncHandler(async (req, res) => {
  const bundle = await authService.loginOrRegisterWithGoogle(req.body.credential, req);
  sendAuthSuccess(res, 200, bundle);
});

export const refresh = asyncHandler(async (req, res) => {
  try {
    const { token, refreshRaw } = await authService.refreshAccessToken(req);
    setRefreshCookie(res, refreshRaw);
    res.json({ success: true, data: { token, accessToken: token } });
  } catch (err) {
    clearRefreshCookie(res);
    throw err;
  }
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutSession(req);
  clearRefreshCookie(res);
  res.json({ success: true, data: { ok: true } });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body);
  res.json({
    success: true,
    data: { ok: true, message: "If an account exists for that email, you will receive reset instructions shortly." },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPasswordWithToken(req.body);
  res.json({ success: true, data: { ok: true, message: "Password updated. You can sign in with your new password." } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});
