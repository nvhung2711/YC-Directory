import NavBar from "@/app/components/NavBar"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <NavBar />
            {children}
        </main>
    )
}