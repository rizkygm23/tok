import {router} from 'next/router'
import Head from "next/head";
import '../app/globals.css'
import inventory from '../data/inventory';
import CardBigSale from '../components/cardBigSale';
import { formatRupiah } from '@/lib/format';
import Link from 'next/link';





export default function LandingPage() {

    
    return (
        <div className='w-full h-full'>
            {/* ini bagian navbar */}
            <nav className='w-full h-fit py-1  sticky top-0 bg-[#374957] z-50'>
                <div className='w-full h-full flex justify-center  py-2 gap-5 text-sm text-slate-200'>
                    <a  className=' hover:underline hover:bg-slate-600 p-3 rounded-full' href='#bigsale'>Big sale</a>
                    <a className=' hover:underline hover:bg-slate-600 p-3 rounded-full' href='#bestseller'>Best seller</a>
                    <a className=' hover:underline hover:bg-slate-600 p-3 rounded-full' href='#preview'>Preview</a>
                </div>

            </nav>

            {/* ini bagian Header */}
            <div className='w-full h-fit  grid grid-cols-1 md:grid-cols-2 mt-20 px-5 md:px-24 lg:px-52'>
                <div className='item-center w-full h-fit py-10 my-auto px-4'>
                    <h1 className=' text-3xl md:text-4xl font-bold'>Temukan Gaya dan Ekspresikan Dirimu!</h1>
                    <h2 className=' text-sm md:text-lg mt-2'>Beragam pilihan fashion terkini yang sesuai dengan kepribadianmu. Jadilah dirimu yang terbaik setiap hari!</h2>
                    <button onClick={() => router.push('/catalog')} className='text-sm md:text-lg bg-[#374957] hover:bg-slate-900 text-white px-4 hover:pr-6 py-2 mt-4 rounded'>See more</button>
                </div>
                <div className=' w-full h-full py-10'>
                    <img src='header-img.png' className='h-[500px] mx-auto'></img>
                </div>
            

            </div>

            {/* ini bagian Bigsale */}
            <div id='bigsale'>
                <h1 className='text-4xl font-bold py-3 px-8 text-center mt-20 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent'>Big Sale</h1>
                <div className='grid grid-cols-3 gap-2 md:gap-4 mt-10 px-5 md:px-24 lg:px-52'>
                {inventory.slice(0, 3).map((item) => <CardBigSale key={item.id} id={item.id} nama={item.name} price={item.price} image_url={item.image_url} />)}
                </div>                            
            </div>

            {/* ini bagian Best seller */}
            <div id='bestseller'>
                <h1 className='text-4xl font-bold py-3 px-8 text-center mt-20 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent'>Best Seller</h1>
                <div className='grid grid-cols-1 gap-4 mt-10 px-5 md:px-24 lg:px-52'>
                {inventory.slice(3, 4).map((item) =>
                <div className='w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='w-full h-fit my-auto '>
                        <h1 className='text-lg md:text-xl lg:text-4xl font-bold '>{item.name}</h1>
                        <h1 className='text-lg italic line-through text-red-700 mt-7'>{formatRupiah(item.price*1.5)}</h1>
                        <h1 className='text-5xl  font-bold mt-3'>{formatRupiah(item.price)}</h1>
                        <button className='bg-[#374957] hover:bg-slate-900 text-white px-8   py-4 mt-4 rounded'>Buy now</button>
                        <h2 className='text-sm mt-3 text-gray-500 bg-gray-200 px-3 py-2 rounded-full w-fit'> 250 Sold</h2>
                    </div>
                    <div className='w-full h-full p-2 md:p-5 lg:p-11'>
                        <img src={item.image_url} className='w-full h-full object-cover rounded-lg'></img>
                    </div>

                    
                </div>
                )}
                </div>                            
            </div>
            <div id="preview" className="relative w-full h-full p-5 md:p-52">
                <img
                    src="preview.png"
                    className="w-full h-full object-cover rounded-2xl shadow-lg border border-[#374957] border-solid transition duration-100 ease-in-out blur-sm hover:blur-none"
                />
                {/* Tombol di tengah */}
                <button
                onClick={() => router.push("/catalog")}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#374957] z-20 text-white px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition duration-300 ease-in-out"
                >
                    See more
                </button>
            </div>

            <div id='footer' className='mt-20 w-full h-80 bg-[#374957] grid grid-cols-1 '>
                <p className='text-white text-center my-auto mx-auto'>Copyright &copy; 2024. All rights reserved.</p>
            </div>

        </div>
    )
}