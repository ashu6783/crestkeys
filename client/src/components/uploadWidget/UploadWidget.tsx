import React, { createContext, useEffect, useState, useCallback } from "react";
import apiRequest from "../../lib/ApiRequest";

interface CloudinaryUploadWidgetConfig {
  cloudName: string;
  uploadPreset?: string;
  folder?: string;
  sources?: string[];
  multiple?: boolean;
  apiKey?: string;
  [key: string]: unknown;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url?: string;
    public_id?: string;
  };
}

interface UploadConfigResponse {
  cloudName: string;
  apiKey: string;
  folder: string;
}

interface UploadWidgetProps {
  uwConfig: CloudinaryUploadWidgetConfig;
  setPublicId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setState: React.Dispatch<React.SetStateAction<string[]>>;
  onUploadComplete: () => void;
}

interface CloudinaryScriptContextType {
  loaded: boolean;
}

const CloudinaryScriptContext = createContext<CloudinaryScriptContextType | undefined>(undefined);

const UploadWidget: React.FC<UploadWidgetProps> = ({
  uwConfig,
  setPublicId,
  setState,
  onUploadComplete,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        const script = document.createElement("script");
        script.async = true;
        script.id = "uw";
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => {
          setLoaded(true);
        });
        script.addEventListener("error", () => {
          setError("Failed to load Cloudinary widget");
          setLoaded(false);
        });
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  const defaultFolder =
    typeof uwConfig.folder === "string" ? uwConfig.folder : "posts";

  const generateUploadSignature = useCallback(
    (
      callback: (signature: string) => void,
      paramsToSign: Record<string, unknown>
    ) => {
      apiRequest
        .post<{ signature: string }>("/upload/sign", {
          params_to_sign: paramsToSign,
        })
        .then(({ data }) => callback(data.signature))
        .catch((err) => {
          console.error("Failed to sign Cloudinary upload:", err);
          setError("Failed to sign upload");
          callback("");
        });
    },
    []
  );

  const fetchUploadWidgetConfig = useCallback(async () => {
    const { data } = await apiRequest.get<UploadConfigResponse>("/upload/sign", {
      params: { folder: defaultFolder },
    });

    return {
      cloudName: data.cloudName,
      apiKey: data.apiKey,
      uploadSignature: generateUploadSignature,
      folder: data.folder,
      ...(uwConfig.sources ? { sources: uwConfig.sources } : {}),
      ...(uwConfig.multiple !== undefined ? { multiple: uwConfig.multiple } : {}),
      ...(typeof uwConfig.maxImageFileSize === "number"
        ? { maxImageFileSize: uwConfig.maxImageFileSize }
        : {}),
    };
  }, [defaultFolder, generateUploadSignature, uwConfig]);

  const initializeCloudinaryWidget = useCallback(async () => {
    if (!loaded || !window.cloudinary?.createUploadWidget) {
      setError("Cloudinary widget not initialized");
      onUploadComplete();
      return;
    }

    setIsOpening(true);
    setError(null);

    try {
      const widgetConfig = await fetchUploadWidgetConfig();
      const myWidget = window.cloudinary.createUploadWidget(
        widgetConfig,
        (uploadError: unknown, result: CloudinaryUploadResult) => {
          if (uploadError) {
            const errorMessage =
              uploadError instanceof Error ? uploadError.message : String(uploadError);
            setError("Upload failed: " + errorMessage);
            onUploadComplete();
            return;
          }

          if (result?.event === "success" && result.info.secure_url) {
            const newUrl = result.info.secure_url;
            if (typeof newUrl === "string" && newUrl.startsWith("https://")) {
              setState((prev) => {
                if (prev.includes(newUrl)) return prev;
                return [...prev, newUrl];
              });
            } else {
              setError("Invalid image URL received");
            }

            if (setPublicId && result.info.public_id) {
              setPublicId(result.info.public_id);
            }
          }

          onUploadComplete();
        }
      );

      myWidget.open();
    } catch (err) {
      console.error("Failed to open Cloudinary widget:", err);
      setError("Failed to prepare signed upload");
      onUploadComplete();
    } finally {
      setIsOpening(false);
    }
  }, [loaded, fetchUploadWidgetConfig, setState, setPublicId, onUploadComplete]);

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 disabled:bg-gray-400"
        onClick={initializeCloudinaryWidget}
        disabled={!loaded || !!error || isOpening}
      >
        {isOpening ? "Preparing..." : "Upload"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </CloudinaryScriptContext.Provider>
  );
};

export default UploadWidget;
export { CloudinaryScriptContext };
