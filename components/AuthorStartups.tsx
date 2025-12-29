import StartupCard from "@/components/StartupCard";
import { IStartup } from "@/database/startup.model";
import { getStartupsByAuthor } from "@/lib/actions/startup.actions";

const AuthorStartups = async ({ id }: { id: string }) => {
    const response = await getStartupsByAuthor(id);

    if (response.status === "ERROR") throw new Error(response.error);

    const startups = response.startups as IStartup[];

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