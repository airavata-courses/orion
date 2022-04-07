#
FROM python:3.8

#
WORKDIR /merra-plot-microservice

#
COPY ./requirements.txt /merra-plot-microservice/requirements.txt

FROM continuumio/miniconda3

RUN conda install -c conda-forge proj

RUN pip install shapely

RUN pip install geos

RUN conda install -c conda-forge cartopy

#
RUN pip install netCDF4

RUN pip install --upgrade pip setuptools wheel

RUN pip install pooch

#
WORKDIR /merra-plot-microservice

#
COPY ./requirements.txt /merra-plot-microservice/requirements.txt

#
RUN pip install --no-cache-dir --upgrade -r /merra-plot-microservice/requirements.txt

#
COPY ./merra_weather /merra-plot-microservice/merra_weather

#
WORKDIR ./merra_weather

#
CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]