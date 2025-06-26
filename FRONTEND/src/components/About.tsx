import '../css/About.css'

interface AboutProps {
  onBack: () => void;
}

function About({ onBack }: AboutProps) {
    return (
        <div className="about-container">
            <h1>Thanks for checking out OSRS CL</h1>
            <button onClick={onBack}>Back</button>
        </div>
    )
}

export default About; 