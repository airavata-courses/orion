#
FROM python:3.8

#
WORKDIR /merra-plot-microservice

#
COPY ./requirements.txt /merra-plot-microservice/requirements.txt

#
RUN pip install netCDF4

#
RUN pip install geos

RUN pip install --upgrade pip setuptools wheel

RUN pip install pooch

RUN pip3 install arm_pyart==1.11.8

#
RUN pip install --no-cache-dir --upgrade -r /merra-plot-microservice/requirements.txt

#
COPY ./merra_weather /merra-plot-microservices/merra_weather

#
WORKDIR ./merra_weather

#
CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]