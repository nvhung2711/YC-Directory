import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return <h1 className="text-3xl">User Profile: {id}</h1>;
};

export default page;
