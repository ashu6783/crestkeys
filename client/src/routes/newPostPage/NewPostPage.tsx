import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import apiRequest from "../../lib/ApiRequest";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.string().min(1, "Price is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  bedroom: z.string().min(1, "Bedroom number is required"),
  bathroom: z.string().min(1, "Bathroom number is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  type: z.enum(["rent", "buy", "vacation"]).default("rent"),
  property: z.enum(["apartment", "house", "condo", "land"]).default("apartment"),
  utilities: z.string().optional(),
  pet: z.string().optional(),
  income: z.string().optional(),
  size: z.string().optional(),
  school: z.string().optional(),
  bus: z.string().optional(),
  restaurant: z.string().optional(),
});

type FormValues = z.infer<typeof postSchema>;

function NewPostPage() {
  const [images, setImages] = useState<string[]>([]);
  const [widgetLoading, setWidgetLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(postSchema) as any,
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);

    if (images.length === 0) {
      setSubmitError("Please upload at least one image");
      return;
    }

    const editorContent = editor?.getHTML().trim();
    if (!editorContent || editorContent === "<p></p>") {
      setSubmitError("Please provide a description");
      return;
    }

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: data.title,
          price: parseInt(data.price),
          address: data.address,
          city: data.city,
          bedroom: parseInt(data.bedroom),
          bathroom: parseInt(data.bathroom),
          type: data.type,
          property: data.property,
          latitude: data.latitude,
          longitude: data.longitude,
          images,
        },
        postDetail: {
          desc: editorContent,
          utilities: data.utilities || undefined,
          pet: data.pet || undefined,
          income: data.income || undefined,
          size: data.size ? parseInt(data.size) : undefined,
          school: data.school ? parseFloat(data.school) : undefined,
          bus: data.bus ? parseFloat(data.bus) : undefined,
          restaurant: data.restaurant ? parseFloat(data.restaurant) : undefined,
        },
      });
      navigate(`/${res.data._id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.message || "Failed to create post");
    }
  };

  const handleUploadComplete = () => {
    setIsUploading(false);
    setWidgetLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-6">
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Post</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              {...register("title")}
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && <span className="text-red-600 text-sm">{errors.title.message}</span>}
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              id="price"
              type="number"
              min="0"
              {...register("price")}
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.price && <span className="text-red-600 text-sm">{errors.price.message}</span>}
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              id="address"
              {...register("address")}
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.address && <span className="text-red-600 text-sm">{errors.address.message}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col mb-6">
            <label htmlFor="desc" className="text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="border border-gray-300 rounded-md p-2 min-h-40">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Other Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            {["city", "bedroom", "bathroom", "latitude", "longitude"].map((field) => (
              <div key={field} className="flex flex-col">
                <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  id={field}
                  type={field.includes("bedroom") || field.includes("bathroom") ? "number" : "text"}
                  min={field.includes("bedroom") || field.includes("bathroom") ? 1 : undefined}
                  {...register(field as keyof FormValues)}
                  className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors[field as keyof FormValues] && <span className="text-red-600 text-sm">{errors[field as keyof FormValues]?.message}</span>}
              </div>
            ))}

            {/* Type & Property */}
            <div className="flex flex-col">
              <label htmlFor="type" className="text-sm font-medium text-gray-700 mb-1">Type</label>
              <select {...register("type")} className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
                <option value="vacation">Vacation</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="property" className="text-sm font-medium text-gray-700 mb-1">Property</label>
              <select {...register("property")} className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>

          {/* Upload Widget */}
          <div className="flex flex-col space-y-4 mt-4">
            <label className="text-sm font-medium text-gray-700">Property Images</label>
            {widgetLoading && <div className="text-blue-600 font-medium">Loading upload widget...</div>}
            <UploadWidget
              uwConfig={{
                sources: ["local", "url", "camera"],
                multiple: true,
                cloudName: "ashuudev",
                folder: "posts",
              }}
              setState={(urls) => {
                setImages(urls);
                setIsUploading(false);
              }}
              onUploadComplete={handleUploadComplete}
            />
            {isUploading && <span className="text-blue-600 ml-2">Uploading image...</span>}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`Uploaded ${i + 1}`} className="w-full h-32 object-cover rounded-md border border-gray-300" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {submitError && <p className="text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={images.length === 0 || isUploading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Submit
          </button>
          {images.length === 0 && <p className="text-yellow-600 text-sm mt-2">Please upload at least one image to submit</p>}
        </form>
      </div>
    </div>
  );
}

export default NewPostPage;
