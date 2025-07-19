
'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import RegUsers from "@/components/admin/RegUsers";

const Users = () => {
  return (
      <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
          <RegUsers />
          <Footer />
      </div>
  );
};

export default Users;