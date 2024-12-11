import React from "react";
import { useRouter } from "next/router";
import { formatRupiah } from "@/lib/format";

export default function CardBigSale({ id, nama, price, image_url }) {

    const router = useRouter();

    // const formatRupiah = (angka) => {
    //   return new Intl.NumberFormat("id-ID", {
    //     style: "currency",
    //     currency: "IDR",
    //     maximumFractionDigits: 0,
    //   }).format(angka);
    // };
  
    return (
      <div onClick={() => router.push(`detail/?id=${id}`)} className="w-full h-full grid grid-cols-1 overflow-hidden bg-slate-100 rounded-[22px] p-1 md:p-4 hover:translate-y-1 ease-in-out duration-[20000] ">
        <img src={image_url} alt={nama} className="w-full h-full rounded-3xl md:rounded-md " />
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className=" text-[8px] md:text-lg text-center font-semibold line-clamp-2 mt-3">{nama}</h1>
          <h1 className="text-sm md:text-2xl font-bold mt-2 grid grid-cols-1 md:flex"><span className="line-through text-[10px] md:text-sm italic text-red-700 mx-1">{formatRupiah(price*1.5)}</span>{formatRupiah(price)}</h1>
        </div>
      </div>
    );
  }
  