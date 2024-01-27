'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios'
import Image from "next/image";
import { saveAs } from 'file-saver';

export default function Home() {
  const router = useRouter();
  const [user, setUser]:any = useState(false);
  const [newFile, setNewFile]:any = useState(null);
  const [files, setFiles]:any = useState([]);
  const [pin, setPin] = useState('')
  const [activeImage, setActiveImage]:any = useState(null)
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/', {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
        if (response.status===200) {
          setUser(response.data);
          console.log('User found!', user);
          await getAllMyFiles();
        } else {
          router.push('/login');
          console.log('No user found!');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login');
      }
    };

    checkAuthentication();
  }, []);

  const handleFileChange = async (event:any) => {
    if(!event.target.files.length) return setNewFile(null);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const { name, type } = selectedFile;
      const url = await fileToBase64(selectedFile);
      setNewFile({ name, type, url });
    }
    event.target.files = null;
  }

  const fileToBase64 = (file:any): Promise<string> => {
    console.log(file)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString();
        resolve(base64String || '');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async () => {
    if(!newFile) return alert("No file to upload");
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/files/upload',
      {file:newFile},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      if(res.status===201) {
        alert(`File uploaded! Your code is ${res.data.uniqueString}`);
        console.log(res.data);
        setFiles(res.data.files);
      }
    } catch (error:any) {
      console.log(error);
    }
    setNewFile(null);
  }

  const handleFileDownload = async () => {
    if(pin.length<5) return;
    if(pin===activeImage.substring(0, 6)) {
      console.log(true)
      const imgUrl = `http://localhost:5000/api/files/download/?image=${activeImage}`;
      const fileName = activeImage.split('-').slice(1).join('-');
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(imgUrl, { 
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        saveAs(response.data, fileName);
        setPin('');
        setActiveImage(null);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    } else alert("Incorrect PIN!")
  }

  const getAllMyFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/files/all', {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      if (response.status===200) {
        setFiles(response.data);
        console.log("Got Files!", response.data);        
      } else {
        console.log('No file found!');
      }
    } catch (error) {
      console.error('Error getting files:', error);
    }
  }

  const getImage = (folderName:string, imgName:string) => {
    const parts = imgName.split('.');
    const fileExtension = parts[parts.length - 1].toLowerCase();

    if (['jpeg', 'jpg', 'png'].includes(fileExtension)) {
      // Image file
      try {
        const image = require(`../api/uploads/${folderName}/${imgName}`);
        return image;
      } catch (error) {
        console.error('Error loading image:', error);
        return 'https://dummyimage.com/80x80';
      }
    } else {
      // Non-image file
      return 'https://dummyimage.com/80x80';
    }
  }


  if(!user) return <h1>Loading..</h1>
  return (
    <section className="text-gray-600 body-font">{
      activeImage ?
      <div className="fixed top-0 left-0 right-0 bottom-0 m-auto 
      flex items-center justify-center gap-2 w-100 h-100 bg-gray-900 z-10">
        <input id="pin" className='h-8 w-[200px] px-1 rounded-sm focus:outline outline-2 outline-violet-900' 
        type="text" name='username' placeholder="PIN" maxLength={6}
        value={pin} onChange={(e) => setPin(e.target.value)}/> 
        <button className="items-center text-medium px-4 h-8 rounded-full font-bold bg-violet-800 text-white hover:bg-violet-900"
          onClick={handleFileDownload}>
            Submit
        </button>
        <button className="items-center text-medium h-8 w-8 rounded-full font-bold bg-white text-violet-900 hover:bg-violet-100"
          onClick={() => setActiveImage(null)}>
            X
        </button>
      </div>
      : <></>
    }
      <div className="container px-5 py-6 mx-auto">
        <p className="text-right font-bold text-violet-300">User: {user.username}</p>
        <div className="flex flex-col text-center w-full mb-10">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">File Bucket</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Keep your photos safe with 6 digit password</p>
        </div>
        <div className="p-2 w-full lg:w-1/2 mx-auto">
          <h5 className="text-lg font-medium title-font mb-1 text-center text-gray-700">Add a new file here..</h5>
          <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
            <Image alt="team" width={100} height={100} className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" 
              src={newFile && !newFile.type.includes('/pdf') && !newFile.type.includes('/csv') ? newFile.url : "https://dummyimage.com/80x80"}></Image>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input type="file" className="block w-full text-sm text-slate-500
                file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                accept="image/*, application/pdf, text/csv"
                onChange={handleFileChange}
              />
            </label>
            <button className="flex items-center text-sm py-2 px-4 ml-auto rounded-full font-semibold bg-violet-800 text-white hover:bg-violet-900"
              onClick={handleFileUpload}>
              <svg className="-rotate-90 w-4 h-4 mr-1" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
              Upload
            </button>
          </div>
        </div>
        <h5 className="text-lg font-medium title-font mt-6 mb-1 text-center text-gray-700">History</h5>
        {
          files.length 
          ?
          <div className="flex flex-wrap -m-2">
            {
              files.map((file:any, i:number) => (
                <div key={file} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                  <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                    <Image alt="team" width={100} height={100} 
                      className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" 
                      src={getImage(`${user._id}`, `${file}`)}>
                    </Image>
                    <div className="flex-grow  max-w-44 lg:max-w-56">
                      <h2 className="text-gray-900 title-font font-medium truncate">{
                        file.split('-').slice(1).join('-')
                      }
                      </h2>
                      <p className="text-gray-500">{
                        new Date(parseInt(file.split('-')[0].toString().substring(6))).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      }
                      </p>
                    </div>
                    <button className="flex items-center text-sm py-2 px-4 ml-auto rounded-full font-semibold bg-violet-800 text-white hover:bg-violet-900"
                      onClick={() => setActiveImage(file)}>
                      <svg className="rotate-90 w-4 h-4 mr-1" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                      Save
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          :
          <h6 className="text-medium font-medium title-font mt-2 mb-1 text-center text-gray-400">No files yet!</h6>
        }
      </div>
    </section>
  );
}

