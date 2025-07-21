import dynamic from "next/dynamic";
import Link from "next/link";

export default function Home() {
  const cards: any = [
    {
      title: "Latency Data",
      href: "/latencydata",
      image: "/datasets/preview.png",
    },
    {
      title: "Crypto Data",
      href: "/cryptoglobe",
      image: "/datasets/preview2.png",
    },
    {
      title: "Real-Time Data",
      href: "/realtimedata",
      image: "/datasets/preview3.png",
    },
    {
      title: "Historical Trend",
      href: "/historicaltrend",
      image: "/datasets/preview5.jpeg",
    },
    {
      title: "Cloud Provider Trend",
      href: "/clousprovider",
      image: "/datasets/preview4.png",
    },
  ];

  return (
    <div className="video-bg-wrapper">
      <video autoPlay muted loop playsInline className="video-bg">
        <source src="/datasets/bluehd.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="main-content container py-5">
        <h1 className="text-center text-white mb-5">
          Latency Topology Visualizer
        </h1>
        <div className="row  g-4">
          {cards.map((card: any, idx: any) => (
            <div key={idx} className=" col-12 col-sm-6 col-md-4 col-lg-3">
              <Link href={card.href} className="text-decoration-none">
                <div
                  className="kale card text-white bg-dark card-overlay"
                  style={{
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "300px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 10px 16px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="card-body d-flex align-items-end p-3 card-body-overlay">
                    <h5 className="card-title fw-bold m-0">{card.title}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
