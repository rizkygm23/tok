import { router } from "next/router";
import Head from "next/head";
import "../app/globals.css";
import inventory from "../data/inventory";
import CardBigSale from "../components/cardBigSale";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";
import { fadeIn } from "@/components/Fade";
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/navbar";
const delay = 0.3;
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="w-full h-full bg-slate-100 text-black">
      <Header />
      {/* ini bagian Header */}
      <div className="w-full h-fit  grid grid-cols-1 md:grid-cols-2 mt-20 px-5 md:px-24 lg:px-52">
        <div className="item-center w-full h-fit py-10 my-auto px-4">
          <motion.h1
            variants={fadeIn("up", 0.3)}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: true, amount: 0.1 }}
            className=" text-3xl md:text-4xl font-bold text-black"
          >
            Temukan Gaya dan Ekspresikan Dirimu!
          </motion.h1>
          <motion.h2
            variants={fadeIn("up", 0.4)}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: true, amount: 0.1 }}
            className=" text-sm md:text-lg mt-2 text-black"
          >
            Beragam pilihan fashion terkini yang sesuai dengan kepribadianmu.
            Jadilah dirimu yang terbaik setiap hari!
          </motion.h2>
          <motion.button
            onClick={() => router.push("/catalog")}
            variants={fadeIn("right", 0.3)}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: true, amount: 0.1 }}
            className="text-sm md:text-lg bg-[#374957] hover:bg-slate-900 text-white px-4 hover:pr-6 py-2 mt-4 rounded"
          >
            See more
          </motion.button>
        </div>
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial={"hidden"}
          whileInView={"show"}
          viewport={{ once: true, amount: 0.1 }}
          className=" w-full h-full py-10"
        >
          <img src="header-img.png" className="h-[500px] mx-auto"></img>
        </motion.div>
      </div>

      {/* ini bagian Bigsale */}
      <div
        id="bigsale"
        className="md:pt-24 bg-gradient-to-b from-[#374957] to-slate-100 pt-3  pb-10 md:pb-20 lg:mx-24 rounded-xl"
      >
        <h1 className=" bg-slate-100 text-md md:text-4xl font-bold py-3 px-8 text-center rounded-tl-xl rounded-br-xl text-[#374957] w-fit mx-auto ">
          Big Sale
        </h1>
        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-10 px-5 md:px-24 lg:px-52 ">
          {inventory.slice(0, 3).map((item, index) => (
            <CardBigSale
              key={item.id}
              id={item.id}
              nama={item.name}
              price={item.price}
              image_url={item.image_url}
              delay={delay * index}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* ini bagian Best seller */}
      <div id="bestseller" className="md:pt-24">
        <h1 className=" bg-slate-100 text-md md:text-4xl font-bold py-3 px-8 text-center text-[#374957]  w-fit mx-auto ">
          Best Seller
        </h1>
        <div className="grid grid-cols-1 gap-4 mt-10 px-5 md:px-24 lg:px-52">
          {inventory.slice(3, 4).map((item) => (
            <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-200 rounded-xl px-10 py-10">
              <motion.div
                variants={fadeIn("up", 0.3)}
                initial={"hidden"}
                whileInView={"show"}
                viewport={{ once: true, amount: 0.1 }}
                className="w-full h-fit my-auto "
              >
                <h1 className="text-lg md:text-xl lg:text-4xl font-bold ">
                  {item.name}
                </h1>
                <h1 className="text-lg italic line-through text-red-700 mt-7">
                  {formatRupiah(item.price * 1.5)}
                </h1>
                <h1 className="text-5xl  font-bold mt-3">
                  {formatRupiah(item.price)}
                </h1>
                <button
                  onClick={() => router.push(`/detail/?id=${item.id}`)}
                  className="bg-[#374957] hover:bg-slate-900 text-white px-8   py-4 mt-4 rounded"
                >
                  Buy now
                </button>
                <h2 className="text-sm mt-3 text-gray-500 bg-gray-200 px-3 py-2 rounded-full w-fit">
                  {" "}
                  250 Sold
                </h2>
              </motion.div>
              <motion.div
                variants={fadeIn("up", 0.3)}
                initial={"hidden"}
                whileInView={"show"}
                viewport={{ once: true, amount: 0.1 }}
                className="w-full h-full  "
              >
                <img
                  src={item.image_url}
                  className="w-full h-full object-cover rounded-lg"
                ></img>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        id="preview"
        variants={fadeIn("up", 0.3)}
        initial={"hidden"}
        whileInView={"show"}
        viewport={{ once: true, amount: 0.1 }}
        className="relative w-full h-full p-5 md:p-52 "
      >
        <video
          onClick={() => router.push("/catalog")}
        
          src="/preview.mp4"
          className="w-full h-full  object-cover rounded-2xl  shadow-lg border border-[#374957] border-solid transition duration-100 ease-in-out md:blur-sm hover:blur-none"
          autoPlay
          loop
          muted
          playsInline
        />
        <button
          onClick={() => router.push("/catalog")}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#374957] z-20 text-white px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition duration-300 ease-in-out"
        >
          See more
        </button>
      </motion.div>

      

      <Footer />
      {/* 
      <div
        id="footer"
        className="mt-20 w-full h-fit bg-[#374957] grid grid-cols-1 "
      >
        <p className="text-white text-center mt-20 mx-auto">
          Copyright &copy; 2024. All rights reserved.
        </p>
      </div> */}
    </div>
  );
}
