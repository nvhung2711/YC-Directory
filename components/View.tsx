import Ping from "@/components/Ping";

const View = async ({ views }: { views: number }) => {
    return (
        <div className="view-container">
            <div className="absolute -top-2 -right-2">
                <Ping />
            </div>

            <p className="view-text">
                <span className="font-black">Views: {views}</span>
            </p>
        </div>
    )
}

export default View