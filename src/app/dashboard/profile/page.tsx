"use client";
import useFetch from "@/hooks/useFetch";
import { getUserDetail, editUser } from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, AtSign, Edit3, LogOut, Save, X, Camera } from "lucide-react";
import { FormInput } from "@/components/ui/form/form-input";
import Loader from "@/components/ui/loader/loader";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function ViewProfile() {
  const { post } = useFetch();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      mobileNo: "",
      user_name: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await post(getUserDetail);
      const { statusCode, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        setData(data);
        reset(data);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formValues: any) => {
    try {
      const payload = {
        data: {
          _id: formValues._id,
          full_name: formValues.full_name,
          mobileNo: formValues.mobileNo,
          user_name: formValues.user_name
        }
      }
      const response = await post(editUser, payload);
      const { statusCode, data } = response.data;
      if (statusCode === eHTTPStatusCode.OK) {
        toast.success("Profile updated!");
        setData(data);
        setEditMode(false);
        fetchData();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading && !data) {
    return <div className="flex justify-center p-12"><Loader size={"40px"} className="text-primary" /></div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-primary/80 to-purple-600/80 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              {data?.profile_picture ? (
                <Image
                  src={data?.profile_picture}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-[2rem] object-cover border-4 border-background shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-[2rem] bg-background border-4 border-background shadow-xl flex items-center justify-center text-primary">
                  <User size={64} />
                </div>
              )}
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-transform hover:scale-110">
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black">{data?.full_name || data?.name}</h2>
              <p className="text-muted-foreground font-medium flex items-center gap-1">
                <AtSign size={14} /> {data?.user_name}
              </p>
            </div>
            <div className="flex gap-2">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-2.5 rounded-2xl font-bold hover:bg-primary/20 transition-all active:scale-95"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
              ) : null}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-6 py-2.5 rounded-2xl font-bold hover:bg-rose-500/20 transition-all active:scale-95"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!editMode ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <InfoItem icon={Mail} label="Email Address" value={data?.email} />
                <InfoItem icon={Phone} label="Mobile Number" value={data?.mobileNo} />
                <InfoItem icon={User} label="Full Name" value={data?.full_name} />
                <InfoItem icon={AtSign} label="Username" value={data?.user_name} />
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    isRequired
                    register={register}
                    name="full_name"
                    error={errors.full_name?.message}
                    placeholder="Enter your full name"
                  />
                  <FormInput
                    label="Email"
                    disabled
                    register={register}
                    name="email"
                    placeholder="Email address"
                  />
                  <FormInput
                    label="Mobile Number"
                    isRequired
                    register={register}
                    name="mobileNo"
                    error={errors.mobileNo?.message}
                    placeholder="Enter mobile number"
                  />
                  <FormInput
                    label="Username"
                    isRequired
                    register={register}
                    name="user_name"
                    error={errors.user_name?.message}
                    placeholder="Choose a username"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      reset(data);
                      setEditMode(false);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-muted-foreground hover:bg-muted transition-all"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-muted/30 p-5 rounded-3xl border border-white/5">
      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 flex items-center gap-2">
        <Icon size={12} /> {label}
      </p>
      <p className="font-bold text-lg">{value || "Not set"}</p>
    </div>
  );
}
