import SearchForm from "../../components/SearchForm";
import { IStartup } from "@/database/startup.model";
import StartupCard from "@/components/StartupCard";

import { getStartups, getStartupsBySearch } from "@/lib/actions/startup.actions";

const Home = async ({ searchParams }: {
    searchParams: Promise<{ query?: string }>
}) => {
    const query = (await searchParams).query;

    let response;

    if (!query) {
        response = await getStartups();
    } else {
        response = await getStartupsBySearch(query as string);
    }

    if (response.status === "ERROR") throw new Error(response.error);

    const startups = response.startups;

    return (
        <>
            <section className="pink_container">
                <h1 className="heading">Pitch Your Startup, <br /> Connect With Entrepreneurs</h1>

                <p className="sub-heading max-w-3xl!">
                    Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
                </p>

                <SearchForm query={query} />
            </section>

            <section className="section_container">
                <p className="text-30-semibold">
                    {query ? `Search results for "${query}"` : 'All Startups'}
                </p>

                <ul className="mt-7 card_grid">
                    {startups && startups.length > 0 ? (
                        startups.map((post: IStartup) => (
                            <StartupCard key={post?._id.toString()} post={post} />
                        ))
                    ) : (
                        <p className="no-results">No start ups found</p>
                    )}
                </ul>
            </section>
        </>
    );
};

export default Home;
