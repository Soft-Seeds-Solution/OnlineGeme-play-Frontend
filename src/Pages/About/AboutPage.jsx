import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <div className="page-content">
            <Container>
                <section>
                    <Row className="justify-content-center ">
                        <Col md={8} className="py-4">
                            <h1 className="text-center heading-color mt-3 ">About Kelogy</h1>
                            <h3 className="text-center heading-color mt-3 ">Play free online games anytime, anywhere</h3>
                            <p className="text-center m-0">Kelogy is an online gaming platform where players can enjoy a wide variety of free browser games without downloads, subscriptions, or complicated setup. Whether you enjoy action, puzzle, racing, arcade, strategy, multiplayer, educational, or casual games, Kelogy is built to make gaming simple, fast, and fun for everyone.</p>
                        </Col>
                    </Row>
                </section>

                {/*  */}
                <section>
                    <Row>

                        <div style={{ border: "1px solid black", borderRadius: "5px" }} className="mt-3 bg-white py-2 d-flex align-items-center justify-content-between">
                            <p>Suggested CTA Buttons</p>
                            <Link to="/"> <Button className="btn">Play Games</Button></Link>
                            <Link to="/all-categories"><Button className="btn">Browse Categories</Button></Link>
                        </div>

                        <div className="mt-2">
                            <h2 className="sub-heading">Who We Are</h2>
                            <p>Kelogy is created for people who want quick, enjoyable, and accessible online entertainment. Our goal is to make it easy for anyone to discover and play fun browser games in one place.</p>
                            <p>We believe gaming should be:</p>
                            <ul>
                                <li>Easy to access</li>
                                <li>Free to enjoy</li>
                                <li>Fun for all ages</li>
                                <li>Available on any device</li>
                            </ul>
                            <p>That’s why we focus on offering a smooth experience where users can jump into games instantly without needing long downloads or complex installations.</p>
                        </div>

                        <div className="mt-2">
                            <h2 className="sub-heading">What We Offer</h2>
                            <p>At Kelogy, players can explore a growing collection of online games across different genres and interests. Whether you want to relax, challenge your brain, compete with friends, or simply pass the time, there is something here for you.</p>
                            <p>Our game categories may include:</p>
                            <ul>
                                <li>Action Games</li>
                                <li>Puzzle Games</li>
                                <li>Racing Games</li>
                                <li>Arcade Games</li>
                                <li>Adventure Games</li>
                                <li>Strategy Games</li>
                                <li>Multiplayer Games</li>
                                <li>Trivia & Quiz Games</li>
                                <li>Educational Games</li>
                                <li>Board Games</li>
                                <li>Music & Rhythm Games</li>
                                <li>Casual & Fun Games</li>
                            </ul>
                            <p>This variety helps players of all ages find games that match their mood and p
                                laying style.</p>
                        </div>

                        <div className="bg-white mt-2 p-2">
                            <h2 className="sub-heading">Our Mission</h2>
                            <p>Our mission is simple:</p>
                            <p>To make free online gaming enjoyable, accessible, and convenient for everyone.</p>
                            <p>We want Kelogy to be a place where players can quickly find games they love, discover new favorites, and enjoy a smooth gaming experience directly from their b
                                rowser.</p>
                        </div>

                        <div className="mt-2">
                            <h2 className="sub-heading">Why Players Choose Kelogy</h2>
                            <p>There are many gaming websites online, but Kelogy is designed to keep things simple and user-friendly.</p>
                            <p>Here’s why players enjoy using Kelogy:</p>
                            <ul>
                                <li>Free to play – No payment required to enjoy games</li>
                                <li>No downloads needed – Play directly in your browser</li>
                                <li>Wide variety of games – Different genres for different interests</li>
                                <li>Easy browsing – Find games quickly through categories and search</li>
                                <li>Beginner-friendly experience – Simple and accessible for all types of players</li>
                                <li>Fun for everyone – Suitable for kids, teens, and adults depending on the game</li>
                            </ul>
                            <p>This makes Kelogy ideal for both quick casual play and longer gaming sessions.</p>
                        </div>

                        <div className="mt-2">
                            <h2 className="sub-heading">Who Kelogy Is For</h2>
                            <p>Kelogy is built for a wide audience, including:</p>
                            <ul>
                                <li>Students looking for fun study breaks</li>
                                <li>Casual players who enjoy simple entertainment</li>
                                <li>Puzzle lovers who like brain challenges</li>
                                <li>Competitive players who enjoy skill-based games</li>
                                <li>Families searching for fun browser-based games</li>
                                <li>Anyone who wants instant entertainment without installing apps</li>
                            </ul>
                            <p>Whether you have 5 minutes or 1 hour, Kelogy gives you a quick way to enjoy o
                                nline games.</p>
                        </div>

                        <div className="mt-2">
                            <h2 className="sub-heading">Our Vision</h2>
                            <p>We aim to grow Kelogy into a trusted destination for browser-based gaming by continuing to improve the platform, expand our game library, and create a better experience for players.</p>
                            <p>Our long-term vision is to build a gaming platform where users can:</p>
                            <ul>
                                <li>Discover high-quality online games</li>
                                <li>Explore multiple genres in one place</li>
                                <li>Enjoy a clean, easy-to-use website</li>
                                <li>Return regularly for fresh gaming experiences</li>
                                <li>Our Commitment to Players</li>
                            </ul>
                            <p>We care about the overall user experience, not just the games themselves.</p>
                            <p>That means we work toward:</p>
                            <ul>
                                <li>Easy navigation</li>
                                <li>Better game discovery</li>
                                <li>Mobile-friendly browsing</li>
                                <li>Fast-loading pages</li>
                                <li>A clean and enjoyable experience</li>
                            </ul>
                            <p>Our focus is to make Kelogy a platform players can visit anytime when they w
                                ant entertainment, fun, or a quick gaming break.</p>
                        </div>

                        <div className="mt-2">
                            <h2 className="sub-heading">Join the Fun</h2>
                            <p>Kelogy is more than just a website with games — it is a place where players can explore, enjoy, and come back for more.</p>
                            <p>Whether you love action-packed challenges, brain-teasing puzzles, exciting races, or classic casual fun, Kelogy is here to help you play instantly and enjoy the experience.</p>
                            <p>Start exploring today and discover your next favorite game on Kelogy.</p>
                        </div>

                        <div style={{ border: "1px solid black", borderRadius: "5px" }} className="mt-3 bg-white py-2 d-flex align-items-center justify-content-between">
                            <p>Suggested CTA Buttons</p>
                            <Link to="/"> <Button className="btn">Start Playing</Button></Link>
                            <Link to="/all-categories"><Button className="btn">Explore All Games</Button></Link>
                        </div>
                    </Row>
                </section>
            </Container>

        </div>
    )
}