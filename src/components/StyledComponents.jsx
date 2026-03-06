import styled, { keyframes } from "styled-components";

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatOrb = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -50px) scale(1.1); }
  50% { transform: translate(-20px, -100px) scale(0.9); }
  75% { transform: translate(-40px, -30px) scale(1.05); }
`;

const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0e1a;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(124, 58, 237, 0.08) 0%, transparent 40%);
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  color: #ffffff;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;

  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent 70%);
    border-radius: 50%;
    top: 10%;
    left: 10%;
    animation: ${floatOrb} 20s ease-in-out infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%);
    border-radius: 50%;
    bottom: 15%;
    right: 10%;
    animation: ${floatOrb} 25s ease-in-out infinite reverse;
    pointer-events: none;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 380px;
  max-width: 90vw;
  padding: 3.5rem 3rem;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(124, 58, 237, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  text-align: center;
  position: relative;
  z-index: 10;
  animation: ${fadeSlideUp} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-4px) perspective(800px) rotateX(1deg);
    box-shadow:
      0 32px 64px rgba(0, 0, 0, 0.5),
      0 0 100px rgba(124, 58, 237, 0.1);
  }
`;

export const Input = styled.input`
  margin: 0.6rem 0;
  padding: 1.3rem 1.6rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  font-size: 1.5rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    border-color: #7c3aed;
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

export const Button = styled.button`
  padding: 1.3rem;
  margin: 1.4rem 0 1.2rem;
  border: none;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.1);
  }

  &:active {
    transform: translateY(-1px) scale(0.99);
  }
`;

export const Title = styled.h2`
  margin-bottom: 1.8rem;
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
`;

export const LinkText = styled.span`
  color: #a78bfa;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #c4b5fd;
  }

  &:hover::after {
    width: 100%;
  }
`;
