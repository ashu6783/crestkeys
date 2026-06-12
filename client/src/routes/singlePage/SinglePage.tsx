import { useState, useContext, useCallback, useMemo, memo, lazy, Suspense, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { AuthContext } from "../../context/AuthContext";
import Slider from "../../components/slider/Slider";
import LazyPropertyMap, { type MapItem } from "../../components/map/LazyPropertyMap";
import {
  AreaChart,
  Bath,
  BedSingleIcon,
  Bus,
  Coins,
  Contact,
  CookingPot,
  CreditCard,
  Dog,
  MapPinCheck,
  Power,
  Save,
  School,
  type LucideIcon,
} from "lucide-react";
import { useGetPostByIdQuery } from "../../state/api";
import apiRequest from "../../lib/ApiRequest";
import { parseCoordinate } from "../../lib/utils";

const PaymentCheckout = lazy(() => import("../../components/payment/PaymentCheckout"));

const FeatureItem = memo(function FeatureItem({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
      <Icon className="h-6 w-6 text-[#B8860B] mb-1" />
      <span className="text-xs text-gray-500">{title}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
});

const InfoRow = memo(function InfoRow({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-yellow-100 p-2 rounded-lg">
        <Icon className="h-5 w-5 text-[#B8860B]" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
});

const SinglePage = () => {
  const { id } = useParams<{ id: string }>();
  const isValidPostId = Boolean(id && /^[0-9a-fA-F]{24}$/.test(id));
  const { data: post, isLoading, isError } = useGetPostByIdQuery(id!, {
    skip: !isValidPostId,
  });
  const [saved, setSaved] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentIdempotencyKey, setPaymentIdempotencyKey] = useState("");
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const wantsPayment = searchParams.get("pay") === "true";

  const redirectToLogin = useCallback(
    (returnPath?: string) => {
      const from = returnPath ?? `${location.pathname}?pay=true`;
      navigate("/login", { state: { from } });
    },
    [location.pathname, navigate]
  );

  useEffect(() => {
    if (authLoading || currentUser || !wantsPayment) return;
    redirectToLogin(`${location.pathname}?pay=true`);
  }, [authLoading, currentUser, wantsPayment, location.pathname, redirectToLogin]);

  const handleSave = async () => {
    if (authLoading) return;
    if (!currentUser) return redirectToLogin(location.pathname);
    setSaved((prev: boolean) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post?._id });
    } catch {
      setSaved((prev: boolean) => !prev);
    }
  };

  const handlePaymentSuccess = useCallback(() => {
    setPaymentCompleted(true);
  }, []);

  const handlePayment = useCallback(() => {
    if (authLoading) return;
    if (!currentUser) {
      redirectToLogin(`${location.pathname}?pay=true`);
      return;
    }
    setPaymentIdempotencyKey(crypto.randomUUID());
    setShowPaymentForm(true);
  }, [authLoading, currentUser, redirectToLogin, location.pathname]);

  useEffect(() => {
    if (authLoading || !currentUser || !post || !wantsPayment || showPaymentForm) return;
    setPaymentIdempotencyKey(crypto.randomUUID());
    setShowPaymentForm(true);
  }, [authLoading, currentUser, post, wantsPayment, showPaymentForm]);

  const sanitizedDescription = useMemo(
    () => DOMPurify.sanitize(post?.postDetail?.desc || "<p>No description provided</p>"),
    [post?.postDetail?.desc]
  );

  const mapItems = useMemo((): MapItem[] => {
    const latitude = parseCoordinate(post?.latitude);
    const longitude = parseCoordinate(post?.longitude);
    if (!post || latitude === null || longitude === null) return [];

    return [
      {
        id: post._id,
        title: post.title,
        img: post.images?.[0] || "/default-image.png",
        price: post.price,
        bedroom: post.bedroom,
        latitude,
        longitude,
      },
    ];
  }, [post]);

  if (!isValidPostId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8">
        <div className="text-red-500 text-xl mb-4">Page not found</div>
        <Link to="/" className="bg-[#B8860B] text-white px-6 py-2 rounded-lg hover:bg-[#a17609]">
          Return to Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B8860B] border-t-transparent" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8">
        <div className="text-red-500 text-xl mb-4">Property information not available</div>
        <Link to="/" className="bg-[#B8860B] text-white px-6 py-2 rounded-lg hover:bg-[#a17609]">
          Return to Home
        </Link>
      </div>
    );
  }

  const owner = typeof post.userId === "string" ? undefined : post.userId;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="md:w-3/5 p-4 md:p-8 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            <Slider images={post.images || []} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-col gap-4">
                <h1 className="font-serif text-2xl md:text-3xl font-medium text-gray-800">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinCheck className="h-5 w-5 text-[#B8860B]" />
                  <span>{post.address}</span>
                </div>
                <div className="bg-[#B8860B] text-white rounded-md px-4 py-2 text-lg font-medium w-fit">
                  ${post.price?.toLocaleString()}
                </div>
              </div>

              <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl shadow-sm">
                <img
                  src={owner?.avatar || "/default-avatar.png"}
                  alt={owner?.username || "Owner"}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mb-2"
                />
                <span className="font-medium text-gray-800">{owner?.username || "Owner"}</span>
                <span className="text-xs text-gray-500 mb-2">Property Owner</span>
                <button
                  onClick={handlePayment}
                  className="text-sm bg-white text-[#B8860B] hover:bg-teal-50 border border-teal-300 rounded-full px-3 py-1 flex items-center gap-1"
                >
                  <Contact className="h-5 w-5" /> Pay!
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Description</h2>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>
        </div>
      </div>

      <div className="md:w-2/5 p-4 md:p-8 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between gap-4 mb-8">
            <button
              onClick={handlePayment}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#B8860B] text-white rounded-lg shadow-md"
            >
              <CreditCard className="h-5 w-5" /> Make Payment
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg shadow-md transition-colors ${
                saved
                  ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Save className="h-5 w-5" /> {saved ? "Saved" : "Save Property"}
            </button>
          </div>

          {showPaymentForm && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Secure checkout</h2>
                {!paymentCompleted && (
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {paymentCompleted ? (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-6 text-center">
                  <p className="font-semibold text-green-700">Payment successful</p>
                  <p className="mt-1 text-sm text-green-600">Thank you for your payment.</p>
                </div>
              ) : paymentIdempotencyKey ? (
                <Suspense
                  fallback={
                    <div className="flex justify-center py-10">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B8860B] border-t-transparent" />
                    </div>
                  }
                >
                  <PaymentCheckout
                    postId={post._id}
                    amount={post.price || 0}
                    idempotencyKey={paymentIdempotencyKey}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </Suspense>
              ) : null}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            <FeatureItem icon={AreaChart} title="Size" value={`${post.postDetail?.size || "N/A"} sqft`} />
            <FeatureItem icon={BedSingleIcon} title="Bedrooms" value={post.bedroom || "N/A"} />
            <FeatureItem icon={Bath} title="Bathrooms" value={post.bathroom || "N/A"} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Property Features</h2>
            <InfoRow
              icon={Power}
              title="Utilities"
              description={
                post.postDetail?.utilities === "included"
                  ? "Utilities included"
                  : post.postDetail?.utilities === "excluded"
                  ? "Owner responsible"
                  : post.postDetail?.utilities === "shared"
                  ? "Tenant responsible"
                  : "Information not available"
              }
            />
            <InfoRow
              icon={Dog}
              title="Pet Policy"
              description={
                post.postDetail?.pet === "allowed"
                  ? "Pets allowed"
                  : post.postDetail?.pet === "not_allowed"
                  ? "No pets"
                  : "Information not available"
              }
            />
            <InfoRow
              icon={Coins}
              title="Income Requirement"
              description={post.postDetail?.income || "Information not available"}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Nearby Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FeatureItem icon={School} title="School" value={`${post.postDetail?.school || "N/A"} km`} />
              <FeatureItem icon={Bus} title="Bus Stop" value={`${post.postDetail?.bus || "N/A"} km`} />
              <FeatureItem
                icon={CookingPot}
                title="Restaurant"
                value={`${post.postDetail?.restaurant || "N/A"} km`}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            {mapItems.length > 0 ? (
              <LazyPropertyMap items={mapItems} />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                Map location not available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
