"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface PhotoData {
  isAvatar: boolean;
  authorId: number | null;
  createdAt: Date;
}

interface PhotoContextType {
  photoData: PhotoData;
  setPhotoData: React.Dispatch<React.SetStateAction<PhotoData>>;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photoData, setPhotoData] = useState<PhotoData>(() => {
    const savedData = sessionStorage.getItem("photoData");
    return savedData
      ? JSON.parse(savedData)
      : {
          isAvatar: false,
          authorId: null,
          createdAt: Date,
        };
  });

  // Lưu dữ liệu vào sessionStorage mỗi khi photoData thay đổi
  useEffect(() => {
    sessionStorage.setItem("photoData", JSON.stringify(photoData));
  }, [photoData]);

  return (
    <PhotoContext.Provider value={{ photoData, setPhotoData }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhoto must be used within a PhotoProvider");
  }
  return context;
};
