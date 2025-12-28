import StartupCard from "@/components/StartupCard";
import { IStartup } from "@/database/startup.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const AuthorStartups = async ({ id }: { id: string }) => {
    const response = await fetch(`${BASE_URL}/api/author/${id}/startup`);

    const { startups } = await response.json();

    return (
        <>
            {startups.length > 0 ? (
                startups.map((startup: IStartup) => (
                    <StartupCard key={startup._id.toString()} post={startup} />
                ))
            ) : (
                <p className="no-result">No posts yet</p>
            )}
        </>
    );
};
export default AuthorStartups;