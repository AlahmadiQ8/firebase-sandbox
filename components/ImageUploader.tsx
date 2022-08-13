import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth, storage } from "../lib/firebase";
import { Loader } from "./Loader";

export function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file == null) {
      toast.error('No file provided');
      return;
    }

    const extension = file.type.split('/')[1];

    const fileRef = ref(storage, `uploads/${auth.currentUser!.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(url => {
            setDownloadURL(url);
            setUploading(false);
          });
      });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  );
}
