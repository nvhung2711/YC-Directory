import { IStartup } from "@/database/startup.model";
import SearchForm from "../../components/SearchForm";
import StartupCard from "@/components/StartupCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async ({ searchParams }: {
    searchParams: Promise<{ query?: string }>
}) => {
    const query = (await searchParams).query;

    const response = await fetch(`${BASE_URL}/api/startups`);
    const { startups } = await response.json();

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
                        startups.map((post: IStartup, index: number) => (
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
