import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext, User } from "../../context/AuthContext";
import { LockKeyhole, User as UserIcon, Mail, Shield } from "lucide-react";
import { useLoginMutation, useRegisterMutation } from "../../state/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 chars"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 chars"),
  email: z.string().email("Invalid email"), // <-- also fixed here
  password: z.string().min(6, "Password must be at least 6 chars"),
  accountType: z
    .string()
    .min(1, "Account type is required")
    .refine((val) => ["buyer", "owner", "agent"].includes(val), {
      message: "Invalid account type",
    }),
});


type LoginFormInputs = z.infer<typeof loginSchema>;
type RegisterFormInputs = z.infer<typeof registerSchema>;

const Auth: React.FC = () => {
  const { updateUser, currentUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

  const [activeForm, setActiveForm] = useState<"login" | "register">("login");

  const {
    register,
    handleSubmit,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerField,
    handleSubmit: handleRegisterSubmit,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  if (currentUser && !loading) navigate("/");

  const onLoginSubmit: SubmitHandler<LoginFormInputs> = async ({ username, password }) => {
    try {
      const userResponse = await login({ username, password }).unwrap();

      const user: User = {
        id: userResponse._id,
        _id: userResponse._id,
        name: userResponse.username,
        username: userResponse.username,
        email: userResponse.email,
        avatar: userResponse.avatar || "",
        accountType: userResponse.accountType || "buyer",
      };

      updateUser(user);
      toast.success("Login successful!");
      navigate("/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Login failed");
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterFormInputs> = async ({
    username,
    email,
    password,
    accountType,
  }) => {
    try {
      await registerUser({ username, email, password, accountType }).unwrap();
      toast.success("Registration successful! Please log in.");
      setActiveForm("login");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        Authenticating...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-md">
          {activeForm === "login" ? (
            <form
              onSubmit={handleSubmit(onLoginSubmit)}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                <p className="text-gray-300 text-sm mt-1">Sign in to continue</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                    {...register("username")}
                  />
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                    {...register("password")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:ring-4 focus:ring-cyan-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? "Logging in..." : "Sign In"}
              </button>

              <div className="text-center">
                <p className="text-slate-300 text-sm">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="text-cyan-400 underline hover:text-cyan-300"
                    onClick={() => setActiveForm("register")}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit(onRegisterSubmit)}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Create Account</h1>
                <p className="text-slate-300 text-sm mt-1">Sign up to get started</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                    {...registerField("username")}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                    {...registerField("email")}
                  />
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                    {...registerField("password")}
                  />
                </div>

                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-800/50 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                    {...registerField("accountType")}
                  >
                    <option value="">Select Account Type</option>
                    <option value="buyer">Buyer</option>
                    <option value="owner">Owner</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:ring-4 focus:ring-cyan-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? "Registering..." : "Sign Up"}
              </button>

              <div className="text-center">
                <p className="text-slate-300 text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-cyan-400 underline hover:text-cyan-300"
                    onClick={() => setActiveForm("login")}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
