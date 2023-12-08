import React, { useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import Input from './Input';
import Modal from './Modal';
import { createNewCourse, updateCourse } from '@/utils/fetch';
import { useCourse } from '@/utils/swr';

const options = [
  { label: 'Category', value: '' },
  { label: 'UI/UX Design', value: '6569b03463e7a9d96bbe4fc6' },
  { label: 'Data Science', value: '6569b03463e7a9d96bbe4fcb' },
  { label: 'Web Development', value: '6569b03463e7a9d96bbe4fc8' },
  { label: 'Android Development', value: '6569b03463e7a9d96bbe4fc9' },
  { label: 'IOS Development', value: '6569b03463e7a9d96bbe4fca' },
  { label: 'Product Management', value: '6569b03463e7a9d96bbe4fc7' },
];

export default function ModalCourse({ onClose, editMode, token, courseId, mutate }) {
  const { course, mutate: singleMutate } = useCourse(token, courseId, null, null);

  const [selectedOption, setSelectedOption] = useState('judul');
  const [form, setForm] = useState({
    namaKelas: '',
    kodeKelas: '',
    tipeKelas: '',
    level: '',
    harga: 0,
    Materi: '',
    targetAudience: '',
    thumbnail: null,
  });

  useEffect(() => {
    if (editMode && course) {
      setForm({
        namaKelas: course.title,
        Materi: course.description,
        kodeKelas: course.classCode,
        tipeKelas: course.typeClass,
        level: course.level,
        harga: course.price,
        targetAudience: course.targetAudience,
        thumbnail: course.thumbnail,
      });
      setSelectedOption(course.category._id);
    }
  }, [editMode, course]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const formData = new FormData();
        formData.append('title', form.namaKelas);
        formData.append('description', form.Materi);
        formData.append('classCode', form.kodeKelas);
        formData.append('category', selectedOption);
        formData.append('typeClass', form.tipeKelas);
        formData.append('level', form.level);
        formData.append('price', form.harga);
        formData.append('targetAudience', form.targetAudience);
        formData.append('thumbnail', form.thumbnail);

        const response = await updateCourse(token, courseId, formData);

        if (response.ok) {
          alert('Sukses Edit Data');
          setTimeout(() => {
            setForm({
              namaKelas: '',
              kodeKelas: '',
              tipeKelas: '',
              level: '',
              harga: 0,
              Materi: '',
              targetAudience: '',
              thumbnail: null,
            });
          }, 1000);
          singleMutate();
        }
      } else {
        const newCourseData = {
          title: form.namaKelas,
          description: form.Materi,
          classCode: form.kodeKelas,
          category: selectedOption,
          typeClass: form.tipeKelas,
          level: form.level,
          price: form.harga,
        };

        const response = await createNewCourse(token, newCourseData);

        if (response.ok) {
          alert('Sukses Menambahkan Kelas Baru');
          mutate();
          setForm({
            namaKelas: '',
            kodeKelas: '',
            tipeKelas: '',
            level: '',
            harga: 0,
            Materi: '',
          });
        }
      }
    } catch (error) {
      console.error('Error creating or update course', error);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setForm((prevData) => ({
      ...prevData,
      thumbnail: imageFile,
    }));
  };

  return (
    <Modal
      title={editMode ? 'Edit Kelas' : 'Tambah Kelas'}
      onClose={onClose}
      nameButton={editMode ? 'Perbarui' : 'Simpan'}
      handleSave={handleSave}
    >
      {editMode && (
        <>
          <div className="mt-3 w-full">
            <label className="label-modal">Upload Gambar</label>
            <div className="input-modal-wrapper">
              <input
                type="file"
                accept="image/*"
                thumbnail="image"
                onChange={handleImageChange}
                className="input-modal"
              />
            </div>
          </div>
          <Input
            label="Target Audience"
            name="targetAudience"
            placeholder="Target Audience"
            value={form.targetAudience}
            onChange={handleInputChange}
            textarea
            required
          />
        </>
      )}
      <Input
        type={'text'}
        label="Nama Kelas"
        name="namaKelas"
        placeholder="Nama Kelas"
        value={form.namaKelas}
        onChange={handleInputChange}
        required
      />
      <Dropdown
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
        required
      />
      <Input
        label="Kode Kelas"
        name="kodeKelas"
        placeholder="Kode Kelas"
        value={form.kodeKelas}
        onChange={handleInputChange}
        required
      />
      <Input
        type={'text'}
        label="Tipe Kelas"
        name="tipeKelas"
        placeholder="Tipe Kelas"
        value={form.tipeKelas}
        onChange={handleInputChange}
        required
      />
      <Input
        type={'text'}
        label="Level"
        name="level"
        placeholder="Level"
        value={form.level}
        onChange={handleInputChange}
        required
      />
      <Input
        type={'number'}
        label="Harga"
        name="harga"
        placeholder="Harga"
        value={form.harga}
        onChange={handleInputChange}
        required
      />
      <Input
        label="Materi"
        name="Materi"
        placeholder="Materi"
        value={form.Materi}
        onChange={handleInputChange}
        textarea
        required
      />
    </Modal>
  );
}
