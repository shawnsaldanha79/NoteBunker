import TestimonialItem from "./TestimonialItem";

const Testimonials = () => {
    return (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:px-0 px-5">
            <TestimonialItem
                title="Game Changer"
                text="NoteBunker has completely transformed how I organize my thoughts and research. The security features give me peace of mind knowing my sensitive notes are protected."
                name="Sarah Johnson"
                status="Research Scientist"
            />
            <TestimonialItem
                title="Incredibly Reliable"
                text="As a journalist, I need immediate access to my notes wherever I am. NoteBunker has never let me down, even in areas with poor connectivity."
                name="Michael Chen"
                status="Journalist"
            />
            <TestimonialItem
                title="Perfect for Students"
                text="The organization features and quick search make NoteBunker ideal for managing all my lecture notes and research materials in one secure place."
                name="Emily Rodriguez"
                status="Graduate Student"
            />
        </div>
    );
};

export default Testimonials;
