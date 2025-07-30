import React, { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import token from "@/lib/utilities";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";
import Heading from "@/components/ui/Heading";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.loginUser({
        email: data.email,
        password: data.password,
      });

      if (res.data.code === "OK") {
        Notification.success(res.data.data?.message || "Login successful!");

        token.setAuthToken(res.data.data.token);
        token.setUserData(res.data.data.user);

        const userData = res.data.data.user;
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        Notification.error(res.data.error || "Unexpected response from server.");
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Login failed. Please try again.";

      if (status === 400) {
        msg = error.response?.data?.error || "Invalid email or password.";
      } else if (status === 500) {
        msg = "Server error. Please try again later.";
      }

      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100 transition-all duration-300">
        <Heading className="text-center">
          Welcome Back to <span className="text-accent">XPower</span>
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <TextInput type="email" placeholder="Enter Your Email" {...register("email")} error={errors.email?.message} />

          <TextInput
            type="password"
            placeholder="Enter Your Password"
            {...register("password")}
            error={errors.password?.message}
          />

          <AccentButton type="submit" loading={isSubmitting} spinner={<Spinner color="white" />} text="Login" />

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-accent font-medium">
              Register
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
