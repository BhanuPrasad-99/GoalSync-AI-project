from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()


# -------------------------------------------------
# USER MODEL
# -------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    password = Column(String, nullable=False)

    role = Column(String, default="employee")

    department = Column(String, default="")

    created_at = Column(DateTime, default=datetime.utcnow)

    goals = relationship("Goal", back_populates="owner")


# -------------------------------------------------
# GOAL MODEL
# -------------------------------------------------
class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(Text)

    status = Column(String, default="pending")

    progress = Column(Integer, default=0)

    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="goals")


# -------------------------------------------------
# ACHIEVEMENT MODEL
# -------------------------------------------------
class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    description = Column(Text)

    user_id = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow)


# -------------------------------------------------
# AUDIT LOG MODEL
# -------------------------------------------------
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    action = Column(String)

    user_email = Column(String)

    timestamp = Column(DateTime, default=datetime.utcnow)