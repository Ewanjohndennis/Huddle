function Loading() {
    return (
        <div className="h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background orbs - Swapped to Primary/Accent and increased opacity for visibility */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse-soft"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse-soft" style={{ animationDelay: "1s" }}></div>

            <div className="relative z-10 text-center">
                {/* Animated spinner - Swapped Blue borders for Primary borders */}
                <div className="mb-6 flex justify-center">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-transparent border-b-primary/60 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                    </div>
                </div>

                {/* Text - Swapped Blue gradient for Solid Primary Color */}
                <h2 className="text-2xl font-bold text-primary mb-2 animate-pulse">
                    Loading Huddle
                </h2>
                <p className="text-muted-foreground text-sm">Setting things up for you...</p>

                {/* Dots animation - Swapped Blue bg for Primary bg */}
                <div className="mt-4 flex justify-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                </div>
            </div>
        </div>
    );
}

export default Loading;