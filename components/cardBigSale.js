import React from "react";
import { useRouter } from "next/router";
import { formatRupiah } from "@/lib/format";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/Fade";
export default function CardBigSale({ id, nama, price, image_url, delay }) {
  const router = useRouter();
  return (
    <motion.div
      variants={fadeIn("up", delay)}
      initial={"hidden"}
      whileInView={"show"}
      viewport={{ once: true, amount: 0.1 }}
      onClick={() => router.push(`detail/?id=${id}`)}
      className="w-full h-full grid grid-cols-1 overflow-hidden bg-slate-100 rounded-[22px] p-1 md:p-4 hover:translate-y-1 ease-in-out duration-[20000] shadow-lg hover:shadow-2xl "
    >
      <img
        src={image_url}
        alt={nama}
        className="w-full h-full rounded-3xl md:rounded-md "
      />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className=" text-[8px] md:text-lg text-center font-semibold line-clamp-2 mt-3 text-black">
          {nama}
        </h1>
        <h1 className="text-sm lg:text-2xl font-bold mt-2 grid grid-cols-1 md:flex text-black">
          <span className="line-through text-[10px] lg:text-sm text-red-700 italic mx-1">
            {formatRupiah(price * 1.5)}
          </span>
          {formatRupiah(price)}
        </h1>
      </div>
    </motion.div>
  );
}
