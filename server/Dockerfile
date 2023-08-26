FROM python:3.11.4
ENV PYTHONUNBUFFERED=1
WORKDIR /server
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 8000