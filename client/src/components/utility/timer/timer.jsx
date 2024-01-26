import { useMemo, useState } from "react";

function Timer({ artwork }) {
    const [timeLeft, setTimeLeft] = useState("");

    useMemo(() => {
            const endDateMs = Date.parse(artwork.auctionEndDate);
            
            const interval = setInterval(() => {
                const nowMs = Date.now();

                if (endDateMs <= nowMs) {
                    clearInterval(interval);
                    setTimeLeft("Time has ended");
                } else {
                    const timeLeftMs = endDateMs - nowMs;
                    const secondsLeft = Math.floor(timeLeftMs / 1000) % 60;
                    const minutesLeft = Math.floor(timeLeftMs / 1000 / 60) % 60;
                    const hoursLeft = Math.floor(timeLeftMs / 1000 / 60 / 60) % 24;
                    const daysLeft = Math.floor(timeLeftMs / 1000 / 60 / 60 / 24);
                    setTimeLeft(
                        `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`
                    );
                }
            }, 1000);

            return () => clearInterval(interval);
    }, [artwork]);

    return <div>{timeLeft}</div>;
}

export default Timer;
