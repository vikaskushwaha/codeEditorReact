import { useState } from 'react';
import { HACKER_EARTH_LANGUAGE_FORMAT } from '../configuration/compilerConfiguration';

const useCompileCode = () => {
    const [compiling, setCompiling] = useState(false);
    const [compileError, setCompileError] = useState(null);
    const [outputLink, setOutputLink] = useState(null);

    const getCompilationResult = async (callbackLink) => {
        try {
            const res = await fetch(callbackLink, {
                headers: {
                    'Content-Type': 'application/json',
                    'client-secret': import.meta.env.VITE_HACKER_EARTH_CLIENT_SECRET
                },
            });

            const { result } = await res.json();
            console.log("API Response:", result); // Log the entire response for debugging

            const compileStatus = result.compile_status;
            const runStatus = result.run_status.status;

            if (compileStatus !== 'OK') {
                setCompileError(`Compilation Error: ${compileStatus}`);
                setCompiling(false);
            } else if (runStatus === 'AC') {
                setCompileError(null);
                setOutputLink(result.run_status.output);
                setCompiling(false);
            } else if (runStatus === 'RE') {
                setCompileError(result.run_status.stderr);
                setOutputLink(null);
                setCompiling(false);
            } else {

                setCompileError('Unknown run status');
                setCompiling(false);
            }
        } catch (error) {
            console.error("Error fetching compilation result:", error);
            setCompileError(`Error fetching compilation result: ${error.message}`);
            setCompiling(false);
        }
    };

    const compileCode = async (code, language) => {
        setCompiling(true);
        setCompileError(null);
        setOutputLink(null);

        try {
            const res = await fetch('https://api.hackerearth.com/v4/partner/code-evaluation/submissions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'client-secret': import.meta.env.VITE_HACKER_EARTH_CLIENT_SECRET
                },
                body: JSON.stringify({
                    "lang": HACKER_EARTH_LANGUAGE_FORMAT[language],
                    "source": code,
                    "input": "",
                    "memory_limit": 243232,
                    "time_limit": 5,
                    "context": { id: 213121 },
                    "callback": "https://client.com/callback/"
                })
            });

            const data = await res.json();
            console.log("Submission Response:", data); // Log the submission response for debugging

            const callbackLink = data.status_update_url;
            // Poll for result
            pollForResult(callbackLink);
        } catch (error) {
            console.error("Error submitting code:", error);
            setCompileError(`Error submitting code: ${error.message}`);
            setCompiling(false);
        }
    };

    const pollForResult = (callbackLink, retries = 3) => {
        const pollInterval = 2000; // Interval between polling attempts in milliseconds

        const poll = async (attempt) => {
            try {
                const res = await fetch(callbackLink, {
                    headers: {
                        'Content-Type': 'application/json',
                        'client-secret': import.meta.env.VITE_HACKER_EARTH_CLIENT_SECRET
                    },
                });

                const { result } = await res.json();
                console.log(`Polling attempt ${attempt}:`, result); // Log polling attempts for debugging

                const runStatus = result.run_status.status;

                if (runStatus === 'AC') {
                    setCompileError(null);
                    setOutputLink(result.run_status.output);
                    setCompiling(false);
                } else if (runStatus === 'RE') {
                    setCompileError(result.run_status.stderr);
                    setOutputLink(null);
                    setCompiling(false);
                } else if (attempt < retries) {
                    setTimeout(() => poll(attempt + 1), pollInterval);
                } else {
                    setCompileError('Timeout: Unable to get compilation result');
                    setCompiling(false);
                }
            } catch (error) {
                console.error("Error polling compilation result:", error);
                setCompileError(`Error polling compilation result: ${error.message}`);
                setCompiling(false);
            }
        };

        // Start polling
        poll(1);
    };

    return { outputLink, compiling, compileError, compileCode };
};

export default useCompileCode;
