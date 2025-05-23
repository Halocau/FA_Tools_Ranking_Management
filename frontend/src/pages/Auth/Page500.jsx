import React from "react";
import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";

import { Button } from "react-bootstrap";

const Page500 = () => (
    <>
        {/* <Helmet title="500 Error" /> */}
        <div className="text-center">
            <h1 className="display-1 fw-bold">500</h1>
            <p className="h2">Internal server error.</p>
            <p className="lead fw-normal mt-3 mb-4">
                The server encountered something unexpected that didn't allow it to
                complete the request.
            </p>
            <Link to="/">
                <Button variant="primary" size="lg">
                    Return to website
                </Button>
            </Link>
        </div>
    </>
);

export default Page500;
