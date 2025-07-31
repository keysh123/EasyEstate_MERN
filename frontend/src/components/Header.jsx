import React, { useState } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import { Link , useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm , setSearchTerm] = useState('')
  const navigate = useNavigate()
  const handleSubmit = async (e) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm',searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)


  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    setSearchTerm(urlParams.get('searchTerm'))
  },[location.search])

  return (
    <header className='bg-slate-200 shadow-md sticky top-0 z-50'>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-3'>
        {/* Logo */}
        <Link to='/'>
          <h1 className='font-bold text-xl sm:text-3xl flex flex-wrap'>
            <span className='text-slate-500'>Easy </span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className='hidden sm:flex bg-slate-100 px-3 py-2 rounded-lg items-center'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64 placeholder-slate-500 text-sm'
            value={searchTerm}
            onChange={(e)=>{
              setSearchTerm(e.target.value)
            }}
          />
          <button >
          <FaSearch className='text-slate-500 ml-2' />
          </button>
        </form>

        {/* Desktop Menu */}
        <ul className='hidden sm:flex gap-4 items-center text-slate-700'>
          <li>
            <Link to='/' className='hover:underline'>Home</Link>
          </li>
          <li>
            <Link to='/about' className='hover:underline'>About</Link>
          </li>
          <li>
            
            <Link to='/profile' className='hover:underline'>
            {
              currentUser ?
              <img src={currentUser?.profilePicture} alt="Profile" className='rounded-full h-7 w-7 object-cover'/> :
              <span>Sign In</span>
            }
            </Link>
          </li>
        </ul>

        {/* Hamburger Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='sm:hidden text-slate-700 text-xl'
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className='sm:hidden bg-slate-100 px-4 pb-4 space-y-2 text-slate-700'>
          <li>
            <Link to='/' onClick={() => setMenuOpen(false)} className='block hover:underline'>Home</Link>
          </li>
          <li>
            <Link to='/about' onClick={() => setMenuOpen(false)} className='block hover:underline'>About</Link>
          </li>
          <li>
            <Link to='/login' onClick={() => setMenuOpen(false)} className='block hover:underline'>Sign In</Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
